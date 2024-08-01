const axios = require("axios");
const { getRentspaceId } = require("../helpers/token");
const User = require("../models/User");
const SpaceRent = require("../models/SpaceRent");
const { SpaceRentSchema } = require("../validations/spacerent");
const Wallet = require("../models/Wallet");
const { PaymentSchema } = require("validations/payment");
const Activities = require("../models/Activities");
const { badRequest } = require("../helpers/error");
const { getRandom } = require("../helpers/token");
const { fundWalletMessage, addCardMessage } = require("../helpers/mails/emailTemplates");
const sendEmail = require("services/email");
const RentHistory = require("../models/RentHistory");
const Referral = require("../models/Referral");
const SpaceRentInterestHistory = require("../models/SpaceRentinterestHistory");
const { addSpaceRentReminderToQueue } = require("../queues/spaceRentQueue");

exports.createSpaceRent = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  }
  // Find the wallet associated with the user
  const wallet = await Wallet.findOne({ user: user._id });

  if (!wallet) {
    return res.status(404).json({ error: "Wallet not found" });
  }
  const body = SpaceRentSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const rentspaceId = getRentspaceId(11);

  const checkSpaceRentId = await SpaceRent.findOne({
    rentspace_id: rentspaceId,
  });

  if (checkSpaceRentId) {
    return getRentspaceId(11);
  }
  // if (parseFloat(body.data.interval_amount) > wallet.mainBalance) {
  //   return res.status(400).json({ error: 'Insufficient Balance' });
  // }

  try {
    const createSpaceRent = await SpaceRent.create({
      user: user._id,
      rentName: body.data.rentName,
      due_date: body.data.due_date,
      interval: body.data.interval,
      interval_amount: body.data.interval_amount,
      amount: body.data.amount,
      payment_count: body.data.payment_count,
      rentspace_id: rentspaceId,
      date: body.data.date,
      next_date: body.data.date,
    });
    await createSpaceRent.save();

    const activity = new Activities({
      user: wallet.user._id,
      activityType: "Space Rent Creation",
      description: "New Space Rent Created!!!",
    });
    await activity.save();

    // Add job to space rent reminder queue
    await addSpaceRentReminderToQueue({
      userId: user._id,
      spaceRentId: createSpaceRent._id,
    });

    return res.status(200).json({
      message: "Space Rent Created Successfully",
      createSpaceRent,
    });
  } catch (error) {
    console.error("SPACE RENT ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getUserSpaceRent = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let totalSavings = 0;

    const rents = await SpaceRent.find({ user: id })
      .sort({ timestamp: -1 })
      .lean()
      .populate("loanApplication")
      .exec();

    const rentPromises = rents.map(async (rent) => {
      const rentHistories = await RentHistory.find({ rent: rent._id })
        .sort({ timestamp: -1 })
        .lean()
        .exec();

      const spaceRentInterestHistories = await SpaceRentInterestHistory.find({
        spaceRent: rent._id,
      })
        .sort({ timestamp: -1 })
        .lean()
        .exec();

      rent.rentHistories = rentHistories;
      rent.spaceRentInterestHistories = spaceRentInterestHistories;

      totalSavings += parseFloat(rent.paid_amount);

      return rent;
    });

    const populatedRents = await Promise.all(rentPromises);

    totalSavings = parseFloat(totalSavings.toFixed(2));

    console.log("checking for if it is the user's first space rent ....");
    // Check if the user has received a referral bonus and handle the first rent
    if (rents.length > 0 && !user.has_received_referral_bonus) {
      // Check if the user has paid for at least one rent
      const hasPaidRent = rents.some((rent) => rent.has_paid);

      // If the user has paid for at least one rent
      if (hasPaidRent) {
        // Check if it is the user's first space rent
        const isFirstSpaceRent = rents.length === 1;
        if (isFirstSpaceRent) {
          // Find the referrer
          const referrer = await User.findOne({
            userName: user.referredBy,
          });

          console.log("referrer found for the user", referrer);

          // If the referrer is found, award the referral bonus
          if (referrer) {
            user.has_received_referral_bonus = true;
            user.referredPoints += 500;
            referrer.referralPoints += 500;
            await Promise.all([user.save(), referrer.save()]);
          }
        }
      }
    }

    // Update user's total savings
    user.total_savings = totalSavings;
    await user.save();

    console.log("totalSavings:", totalSavings);

    return res.status(200).json({
      msg: "Space Rent Info Successfully Fetched",
      user,
      rents: populatedRents,
      totalSavings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

// TO GET ALL SPACERENTS
exports.getAllSpaceRents = async (req, res) => {
  try {
    const rents = await SpaceRent.find()
      .sort({ createdAt: -1 })
      .lean()
      .populate("user", "firstName lastName")
      .exec();

    const rentsObject = rents.map((rent) => {
      let fullName = "";
      if (rent.user) {
        fullName = `${rent.user.lastName} ${rent.user.firstName}`;
      }
      return {
        ...rent,
        userFullName: fullName,
        user: undefined,
      };
    });

    res.status(200).json({
      rents: rentsObject,
    });
  } catch (error) {
    console.log("GET ALL SPACERENTS ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getRentHistories = async (req, res) => {
  try {
    const user = req.user;
    console.log("USER=>", user);
    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }

    const spaceRents = await SpaceRent.find({ user: user._id }).lean().exec();
    if (spaceRents.length > 0) {
      const promises = spaceRents.map(async (spaceRent) => {
        const histories = await RentHistory.find({ rent: spaceRent._id })
          .sort({ createdAt: -1 })
          .populate("rent")
          .lean()
          .exec();
        return histories;
      });

      const rentHistories = (await Promise.all(promises)).flat();
      console.log(rentHistories);

      // Sort the flattened array of rent histories by createdAt
      rentHistories.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return res.status(200).json({ rentHistories });
    } else {
      return res
        .status(404)
        .json({ message: "No space rents found for the user" });
    }
  } catch (error) {
    console.log("ERROR GETTING USER RENT HISTORIES=>", error);
    return res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// Function to create rent payment and initiate payment
exports.createRentPaymentAndSpaceRent = async (req, res) => {
  const { id } = req.user;

  try {
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ errors: [{ error: "User not found" }] });
    }

    // Validate the request body
    const paymentBody = PaymentSchema.safeParse(req.body.payment);
    const spaceRentBody = SpaceRentSchema.safeParse(req.body.spaceRent);

    if (!paymentBody.success) {
      return res
        .status(400)
        .json({ "spacerent errors": paymentBody.error.issues });
    }
    if (!spaceRentBody.success) {
      return res
        .status(400)
        .json({ "payment errors": spaceRentBody.error.issues });
    }

    // Find the wallet for the user
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) {
      return res.status(400).json({ error: "Wallet not found" });
    }

    // Prepare payment data for the payment gateway
    const referenceId = "REN" + getRandom(6) + req.body.spaceRent.rentspace_id;
    const paymentData = {
      email: paymentBody.data.email,
      amount: paymentBody.data.amount,
      country: "NG",
      currency: "NGN",
      payment_methods: paymentBody.data.payment_methods,
      merchant_reference: referenceId,
      callback_url: "https://rentspace.tech/payment-notice/",
      wallet_id: process.env.RENT_WALLET_ID,
    };

    // Call the payment gateway API to initiate payment
    const watuPaymentAPIResponse = await axios.post(
      "https://api.watupay.com/v1/payment/initiate",
      paymentData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );

    // Handle the payment gateway response
    if (watuPaymentAPIResponse.data.has_error === false) {
      // Payment was successful
      const paymentOrder = await Payment.create({
        user: id,
        reference: referenceId,
        ...paymentBody.data,
        status_code: watuPaymentAPIResponse.data.status_code,
        transactionId: watuPaymentAPIResponse.data.data.transaction_id,
        status: "Initiated",
      });

      // Save the rent to the database
      const spaceRent = await SpaceRent.create({
        user: id,
        ...spaceRentBody.data,
        rentspace_id: req.body.spaceRent.rentspace_id,
        date: new Date(),
      });

      return res.status(200).json({
        message: "Rent and payment initiated successfully",
        data: { paymentOrder, spaceRent },
      });
    } else {
      // Payment failed
      return res
        .status(400)
        .json({ message: "Payment failed", data: watuPaymentAPIResponse.data });
    }
  } catch (error) {
    console.error("PAYMENT AND RENT CREATION ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.calculateAllRentsAmount = async (req, res) => {
  try {
    const rents = await SpaceRent.aggregate([
      {
        $match: {
          paid_amount: { $ne: 0 },
        },
      },
      {
        $group: {
          _id: null,
          totalPaidAmount: { $sum: "$paid_amount" },
          rentsCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalPaidAmount: { $round: ["$totalPaidAmount", 2] }, // Round totalPaidAmount to 2 decimal places
          rentsCount: 1, // Keep rentsCount field
        },
      },
    ]);

    if (rents.length > 0) {
      console.log(
        "Number of space rents with paid amount greater than zero:",
        rents[0].rentsCount
      );
      console.log("Total Paid Amount for all rents:", rents[0].totalPaidAmount);
      return res.status(200).json({
        msg: "Rent Total",
        total: rents[0].rentsCount,
        total_payment: rents[0].totalPaidAmount,
      });
    } else {
      return res.status(404).json({
        errors: "No space rents found with paid amount not equal to zero.",
      });
      // console.log('No space rents found with paid amount not equal to zero.');
    }
  } catch (error) {
    console.error("Error finding space rents:", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.deleteUserSpaceRent = async (req, res) => {
  const { id } = req.user;
  let user;
  user = await User.findById(id);

  try {
    const { rentspace_id } = req.params;
    console.log(rentspace_id);
    if (!user) {
      return res.status(404).json({ errors: [{ error: "User not found" }] });
    }
    const rent = await SpaceRent.findOneAndDelete({
      rentspace_id: rentspace_id,
    });
    if (!rent) {
      return res.status(404).json({
        errors: [
          {
            error: "SpaceRent not found",
          },
        ],
      });
    }
    res.status(200).json({
      msg: "Space Rent Deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
