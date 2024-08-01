const axios = require("axios");
const { getRandom } = require("../helpers/token");
const Activities = require("../models/Activities");
const BVNDebit = require("../models/BVNDebit");
const BVN = require("../models/BVN");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { BVNSchema } = require("../validations/bvn");
const sendEmail = require("../services/email");
const { welcomeMail } = require("../helpers/mails/emailTemplates");
const {
  MAX_RETRIES,
  RETRY_DELAY,
  YOUVERIFY_TOKEN,
  YOUVERIFY_LIVE_API_URL,
  YOUVERIFY_TEST_API_URL,
} = require("../helpers/constants/youverify");
const { addEmailToQueue } = require("../queues/emailQueue");
const { generateRequestId } = require("../helpers/token");

exports.bvnDebit = async (req, res) => {
  const { id } = req.user;
  let user;
  let wallet;
  user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  }
  const body = BVNSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  try {
    wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const transaction_id = getRandom(10);
    const checkTransactionId = await BVNDebit.findOne({
      transactionId: transaction_id,
    });
    if (checkTransactionId) {
      return getRandom(10);
    }
    wallet = await Wallet.findOneAndUpdate(
      { user: id },
      {
        $set: {
          mainBalance: wallet.mainBalance - 45,
        },
      },
      { new: true }
    );
    const bvn_debit = await BVNDebit.create({
      user: id,
      bvn: body.data.bvn,
      amount: 35,
      charge: 10,
      transactionId: transaction_id,
      verificationType: "BVN Verification",
      date: new Date(),
    });
    await bvn_debit.save();

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          has_bvn: true,
          has_verified_bvn: true,
          bvn: body.data.bvn,
        },
      },
      { new: true }
    );
    const activity = new Activities({
      user: wallet.user._id,
      activityType: "BVN Verification",
      description: "Paid ₦45 for BVN Verification",
    });
    await activity.save();

    return res
      .status(200)
      .json({ msg: "Wallet Debited Succesfully", bvn_debit });
  } catch (error) {
    console.error("BVN DEBIT ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.verifyBVN = async (req, res) => {
  const body = BVNSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  let user = await User.findOne({ email: body.data.email });
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  }

  try {
    const existingUser = await BVN.findOne({ bvn: body.data.bvn });

    if (existingUser) {
      // If a user with the provided BVN already exists, return a message indicating its existence
      return res.status(400).json({
        error: "User with this BVN already exists",
      });
    } else {
      const checkUser = await User.findOne({
        email: body.data.email,
      });

      const userHasBvn = checkUser.has_verified_bvn;
      // const userHasBvn = await User.findOne({
      //     has_verified_bvn: true,
      //   });
      if (!userHasBvn) {
        const bvnData = {
          channel: "bvn-data",
          bvn: body.data.bvn,
        };
        const createBVNResponse = await axios.post(
          "https://api.watupay.com/v1/verify",
          bvnData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
            },
          }
        );

        console.log(bvnData);
        console.log("Watu DVA API Response=>", createBVNResponse.data);

        if (
          createBVNResponse.data.has_error == false &&
          createBVNResponse.data.status_code == 200
        ) {
          // const transaction_id = getRandom(10);
          // const checkTransactionId = await BVNDebit.findOne({ transactionId: transaction_id });
          // if (checkTransactionId) {
          //     return getRandom(10);
          // }
          // wallet = await Wallet.findOneAndUpdate(
          //     {  user: id },
          //     {
          //       $set: {
          //         mainBalance: wallet.mainBalance - 45,
          //       },
          //     },
          //     { new: true }
          // );
          // const bvn_debit = await BVNDebit.create({
          //     user: id,
          //     amount: 35,
          //     charge: 10,
          //     transactionId: transaction_id,
          //     verificationType: "BVN Verification",
          //     date: new Date(),
          // });
          // await bvn_debit.save();

          user = await User.findByIdAndUpdate(
            user._id,
            {
              $set: {
                has_bvn: true,
                has_verified_bvn: true,
                bvn: body.data.bvn,
              },
            },
            { new: true }
          );
          // if (user.referredBy != '') {
          //   user.referredPoints += 500;
          // }
          await user.save();
          const activity = new Activities({
            user: user._id,
            activityType: "BVN Verification",
            description: "BVN Verification Successful",
          });
          await activity.save();
          const bvnInfo = createBVNResponse.data;
          const bvnData = await BVN.create({
            user: user._id,
            bvn: body.data.bvn,
            firstName: createBVNResponse.data.data.first_name,
            middleName: createBVNResponse.data.data.middle_name || "",
            lastName: createBVNResponse.data.data.last_name,
            dob: createBVNResponse.data.data.dob,
            mobile: createBVNResponse.data.data.mobile || "",
            photo: createBVNResponse.data.data.photo || "",
            transaction_ref: createBVNResponse.data.data.reference_id,
          });
          await bvnData.save();
          res.status(200).json({
            message: "User BVN Verified Successfully",

            bvnInfo,
          });
          await sendEmail({
            to: user.email,
            subject: "Welcome to RentSpace!",
            text: `Dear ${user.firstName}, welcome to RentSpace! We are thrilled to have you on board.`,
            html: welcomeMail(user.firstName),
          });
        } else {
          return res.status(400).json({
            msg: createBVNResponse.data.message,
            message: createBVNResponse.data.data,
          });
        }
      } else {
        return res.status(400).json({
          error: "User already has bvn verified",
        });
      }
    }
  } catch (error) {
    console.error("BVN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

async function makeBVNRequest(bvn, attempt = 1) {
  const requestId = generateRequestId();
  try {
    const response = await axios.post(
      YOUVERIFY_LIVE_API_URL,
      {
        id: bvn,
        metadata: { requestId },
        isSubjectConsent: true,
        premiumBVN: true,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: YOUVERIFY_TOKEN,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (attempt < MAX_RETRIES && (status === 402 || status === 500)) {
      console.warn(
        `Attempt ${attempt} failed: ${error.message}. Retrying in ${
          RETRY_DELAY / 1000
        } seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return makeBVNRequest(bvn, attempt + 1);
    } else {
      throw error;
    }
  }
}

exports.youverifyBVNLookup = async (req, res) => {
  const body = BVNSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const [existingUser, user] = await Promise.all([
      BVN.findOne({ bvn: body.data.bvn }),
      User.findOne({ email: body.data.email }).select("-password"),
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this BVN already exists" });
    }

    if (user.has_verified_bvn) {
      return res.status(400).json({ error: "User already has BVN verified" });
    }

    const createBVNResponse = await makeBVNRequest(body.data.bvn);

    if (createBVNResponse.success && createBVNResponse.statusCode === 200) {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            has_bvn: true,
            has_verified_bvn: true,
            bvn: body.data.bvn,
          },
        },
        { new: true }
      );

      await Promise.all([
        updatedUser.save(),
        Activities.create({
          user: user._id,
          activityType: "BVN Verification",
          description: "BVN Verification Successful",
        }),
        BVN.create({
          user: user._id,
          bvn: body.data.bvn,
          firstName: createBVNResponse.data.firstName,
          middleName: createBVNResponse.data.middleName,
          lastName: createBVNResponse.data.lastName,
          dob: createBVNResponse.data.dateOfBirth,
          mobile: createBVNResponse.data.mobile,
          photo: createBVNResponse.data.image,
          transaction_ref: createBVNResponse.data.id,
        }),
      ]);

      await addEmailToQueue({
        to: user.email,
        subject: "Welcome to RentSpace!",
        text: `Dear ${user.firstName}, welcome to RentSpace! We are thrilled to have you on board.`,
        html: welcomeMail(user.firstName),
      });

      res.status(200).json({
        message: "User BVN Verified Successfully",
      });
    } else {
      res.status(400).json({
        msg: createBVNResponse.message,
        message: createBVNResponse.data,
      });
    }
  } catch (error) {
    console.error("BVN ERROR=>", error);
    res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

exports.getAllBVN = async (req, res) => {
  try {
    const bvns = await BVN.find().populate("user", "-password");
    res.status(200).json({
      bvns,
    });
  } catch (error) {
    console.log("GET ALL BVNs ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
