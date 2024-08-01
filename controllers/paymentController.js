const axios = require("axios");
const Activities = require("../models/Activities");
const mongoose = require("mongoose");
const User = require("../models/User");
const Webhook = require("../models/Webhook");
const WebhookRent = require("../models/WebhookRent");
const WebhookDVA = require("../models/WebhookDva");
const WebhookWithdrawal = require("../models/WebhookWithdrawal");
const WebhookWallet = require("../models/WebhookWallet");
const WebhookUtility = require("../models/WebhookUtility");
const ProvidusWebhook = require("../models/ProvidusWebhook");
const Wallet = require("../models/Wallet");
const {
  PaymentSchema,
  RentFundSchema,
  PaymentDateSchema,
} = require("../validations/payment");
const WalletHistory = require("../models/WalletHistory");

const sendEmail = require("../services/email");
const { transfer, walletFunding } = require("../helpers/mails/emailTemplates");
// const WalletWithdrawalHistory = require("../models/WalletWithdrawalHistory");
// const DVAHistory = require("../models/DVAHistory");
const Payment = require("../models/Payment");
const { generateRandomAlphanumeric } = require("../helpers/airtimeRecharge");
const SpaceRent = require("../models/SpaceRent");
const RentHistory = require("../models/RentHistory");
const { getRandom } = require("../helpers/token");
const { walletWithdrawal } = require("./wallet");
const FCMToken = require("../models/FCMToken");
var admin = require("firebase-admin");

const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
const {addSpaceRentFirstDepositCheckToQueue} = require("../queues/spaceRentFirstDepositQueue")
// var fcm = require('fcm-notification');

const {
  calculateRentSpacePoint,
  addSpacePointOnUserInflow,
} = require("../helpers/spacePoint");

exports.createPayment = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  }
  const body = PaymentSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const referenceId = "WAL" + generateRandomAlphanumeric(4) + wallet.walletId;
    const paymentOrder = await Payment.create({
      user: id,
      reference: referenceId,
      ...body.data,
    });

    const paymentData = {
      email: body.data.email,
      amount: body.data.amount,
      country: "NG",
      currency: "NGN",
      payment_methods: body.data.payment_methods,
      merchant_reference: referenceId,
      callback_url: process.env.CALLBACK_URL,
      wallet_id: process.env.DEFAULT_WALLET_ID,
    };

    const watuPaymentAPIResponse = await axios.post(
      process.env.INITIATE_PAYMENT,
      paymentData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );
    console.log(paymentData);
    console.log("Watu API Response=>", watuPaymentAPIResponse.data);
    // const transactionId = watuPaymentAPIResponse.data.transactionId;
    // const message = watuPaymentAPIResponse.data.message;

    const walletHistory = new WalletHistory({
      user: wallet.user, // Assuming 'user' field is populated in Wallet model
      amount: body.data.amount,
      currency: "NGN",
      transactionType: "Credit",
      fees: 0,
      totalAmount: body.data.amount,
      merchantReference: referenceId,
      status: "Pending",
      message: "Space Wallet Funded Through Card",
      description: `Space Wallet Funding to - ${user.dva_number}`,
      // Add other fields as needed
    });
    if (watuPaymentAPIResponse.data.has_error == false) {
      paymentOrder.status_code = watuPaymentAPIResponse.data.status_code;
      walletHistory.transactionReference =
        watuPaymentAPIResponse.data.data.transaction_id;
      paymentOrder.transactionId =
        watuPaymentAPIResponse.data.data.transaction_id;
      paymentOrder.reference = referenceId;
      paymentOrder.message = watuPaymentAPIResponse.data.message;
      paymentOrder.status = "Completed";
      walletHistory.description = `Space Wallet Funding to - ${user.dva_number}`;
      walletHistory.message = watuPaymentAPIResponse.data.message;
      walletHistory.amount = body.data.amount;
      walletHistory.fees = "0";
      walletHistory.totalAmount = body.data.amount;
      walletHistory.merchantReference =
        watuPaymentAPIResponse.data.data.reference;
    } else if (watuPaymentAPIResponse.data.has_error == true) {
      paymentOrder.reference = referenceId;
      // paymentOrder.transactionId = watuPaymentAPIResponse.transactionId;
      paymentOrder.status_code = watuPaymentAPIResponse.data.status_code;
      paymentOrder.status = "Failed";
      walletHistory.status = "Failed";
      walletHistory.message = watuPaymentAPIResponse.data.message;
      walletHistory.description = watuPaymentAPIResponse.data.message;
    }
    await paymentOrder.save();

    await walletHistory.save();
    if (watuPaymentAPIResponse.data.status_code === 200) {
      return res.status(200).json({ message: watuPaymentAPIResponse.data });
    } else {
      return res.status(400).json({ message: watuPaymentAPIResponse.data });
    }
  } catch (error) {
    console.error("PAYMENT ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// exports.fundRentWithWallet = async (req, res) => {
//   const { id } = req.user;
//   const user = await User.findById(id);
//   const userinfo = await User.findById(id);
//   if (!user) {
//     return res.status(404).json({
//       errors: [
//         {
//           error: "User not found",
//         },
//       ],
//     });
//   }
//   const body = RentFundSchema.safeParse(req.body);
//   if (!body.success) {
//     return res.status(400).json({ errors: body.error.issues });
//   }
//   try {
//     const wallet = await Wallet.findOne({ user: id });

//     if (!wallet) return res.status(400).json({ error: "Wallet not found" });
//     const referenceId = "REN" + getRandom(6) + body.data.rentspaceId;

//     const rent = await SpaceRent.findOne({
//       rentspace_id: body.data.rentspaceId,
//     });
//     console.log(rent);
//     if (!rent) return res.status(400).json({ error: "Rent not found" });

//     // const totalAmount = parseFloat(body.data.amount); // Total amount entered by the user
//     const intervalAmount = parseFloat(body.data.interval_amount); // Interval amount entered by the user

//     // Calculate 70% of the total amount
//     // const seventyPercent = 0.7 * totalAmount;

//     // // Calculate 1% of 70% of the total amount
//     // const onePercentOfSeventyPercent = 0.01 * seventyPercent;

//     // Calculate the final amount to be charged
//     const finalAmount = intervalAmount;
//     wallet.mainBalance -= parseFloat(finalAmount);
//     rent.paid_amount += parseFloat(body.data.interval_amount);
//     rent.current_payment += 1;
//     rent.has_paid = true;
//     rent.payment_status = "Active";
//     rent.payment_count -= 1;
//     rent.next_date = body.data.date;

//     const dateParts = body.data.date.split("/");
//     const parsedCreationDate = new Date(
//       `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
//     );
//     console.log(parsedCreationDate);
//     let nextPaymentDate;
//     if (body.data.interval.toLowerCase() == "weekly") {
//       nextPaymentDate = new Date(parsedCreationDate);
//       console.log(nextPaymentDate);
//       nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
//       console.log(nextPaymentDate.getDate() + 7);
//     } else if (body.data.interval.toLowerCase() == "monthly") {
//       nextPaymentDate = new Date(parsedCreationDate);
//       nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
//     }
//     rent.next_date = `${nextPaymentDate.getDate()}/${
//       nextPaymentDate.getMonth() + 1
//     }/${nextPaymentDate.getFullYear()}`;

//     await wallet.save();
//     await rent.save();

//     const walletHistory = new WalletHistory({
//       user: wallet.user, // Assuming 'user' field is populated in Wallet model
//       transactionReference: getRandom(6) + rent.rentspace_id,
//       amount: finalAmount,
//       currency: "NGN",
//       transactionType: "Debit",
//       fees: 0,
//       totalAmount: finalAmount,
//       merchantReference: referenceId,
//       status: "Completed",
//       message: "Space Rent Funded Through Wallet",
//       description: `Space Rent Funding For Rent - ${rent.rentName.toUpperCase()}`,
//       // Add other fields as needed
//     });

//     // Save the WalletHistory document
//     await walletHistory.save();

//     // Create a new WalletHistory document
//     const rentHistory = new RentHistory({
//       user: rent.user, // Assuming 'user' field is populated in Space model
//       rent: rent._id,
//       transactionReference: getRandom(6) + rent.rentspace_id,
//       amount: body.data.interval_amount,
//       currency: "NGN",
//       fees: 0,
//       totalAmount: body.data.interval_amount,
//       merchantReference: referenceId,
//       status: "Completed",
//       message: "Funded Through Space Wallet",
//       description: `Space Rent funding from ${userinfo.firstName}`,
//       // Add other fields as needed
//     });

//     // Save the WalletHistory document
//     await rentHistory.save();

//     // const
//     const activity = new Activities({
//       user: rent.user._id,
//       activityType: "Rent Funding",
//       description: "Space Rent Funded",
//     });
//     await activity.save();
//     // Return the result to the caller (usually the route handler)
//     return res.status(200).json({ msg: "Rent funded successfully", rent });
//     // return { success: true, message: "Rent funded successfully", rent };
//   } catch (error) {
//     console.error("WALLET PAYMENT ERROR=>", error);
//     res.status(500).json({
//       errors: [
//         {
//           error: "Server Error",
//         },
//       ],
//     });
//   }
// };

exports.fundRentWithWallet = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      errors: [{ error: "User not found" }],
    });
  }

  const body = RentFundSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const wallet = await Wallet.findOne({ user: user.id });
    if (!wallet) {
      return res.status(400).json({ error: "Wallet not found" });
    }

    const referenceId = "REN" + getRandom(6) + body.data.rentspaceId;
    const rent = await SpaceRent.findOne({
      rentspace_id: body.data.rentspaceId,
    });

    if (!rent) {
      return res.status(400).json({ error: "Rent not found" });
    }

    const intervalAmount = parseFloat(body.data.interval_amount);
    if (wallet.mainBalance < intervalAmount) {
      return res.status(400).json({ error: "Insufficient Balance" });
    }

    // Check if it is the user's first payment and award 100 space points
    if (rent.firstPayment && !rent.has_paid) {
      user.utility_points += 100;
      rent.firstPayment = false;
      await user.save();
      await rent.save();

      // Add job to the SpaceRent First Deposit Queue for the reminder
      await addSpaceRentFirstDepositCheckToQueue({ userId: user.id });
    } else {
      // Calculate space points for recurring payments
      const { spacePoints } = calculateRentSpacePoint(intervalAmount);
      user.utility_points += spacePoints;
      await user.save();
    }

    // Deduct the amount from wallet and update rent details
    wallet.mainBalance -= intervalAmount;
    rent.paid_amount += intervalAmount;
    rent.current_payment += 1;
    rent.has_paid = true;
    rent.payment_status = "Active";
    rent.payment_count -= 1;
    rent.next_date = body.data.date;

    // Calculate next payment date
    const dateParts = body.data.date.split("/");
    const parsedCreationDate = new Date(
      `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
    );
    let nextPaymentDate = new Date(parsedCreationDate);
    if (body.data.interval.toLowerCase() === "weekly") {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
    } else if (body.data.interval.toLowerCase() === "monthly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    rent.next_date = `${nextPaymentDate.getDate()}/${
      nextPaymentDate.getMonth() + 1
    }/${nextPaymentDate.getFullYear()}`;

    // Save updated wallet and rent information
    await Promise.all([wallet.save(), rent.save(), user.save()]);

    // Create wallet history entry
    const walletHistory = new WalletHistory({
      user: wallet.user,
      transactionReference: getRandom(6) + rent.rentspace_id,
      amount: intervalAmount,
      currency: "NGN",
      transactionType: "Debit",
      fees: 0,
      totalAmount: intervalAmount,
      merchantReference: referenceId,
      status: "Completed",
      message: "Space Rent Funded Through Wallet",
      description: `Space Rent Funding For Rent - ${rent.rentName.toUpperCase()}`,
    });

    // Create rent history entry
    const rentHistory = new RentHistory({
      user: rent.user,
      rent: rent._id,
      transactionReference: getRandom(6) + rent.rentspace_id,
      amount: intervalAmount,
      currency: "NGN",
      fees: 0,
      totalAmount: intervalAmount,
      merchantReference: referenceId,
      status: "Completed",
      message: "Funded Through Space Wallet",
      description: `Space Rent funding from ${user.firstName}`,
    });

    // Log activity
    const activity = new Activities({
      user: rent.user._id,
      activityType: "Rent Funding",
      description: "Space Rent Funded",
    });

    await Promise.all([
      walletHistory.save(),
      rentHistory.save(),
      activity.save(),
    ]);

    return res.status(200).json({ msg: "Rent funded successfully", rent });
  } catch (error) {
    console.error("WALLET PAYMENT ERROR=>", error);
    return res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

exports.calculateNextPaymentDate = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const userinfo = await User.findById(id);
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
    const currentDate = new Date();
    const nextPaymentDateString = "02/03/2024";

    // Parse the next payment date string into a Date object
    const nextPaymentDateParts = nextPaymentDateString.split("/");
    const nextPaymentDatesss = new Date(
      nextPaymentDateParts[2],
      nextPaymentDateParts[1] - 1, // Month is zero-based
      nextPaymentDateParts[0]
    );
    console.log("currentDate");
    console.log(currentDate);
    console.log("nextPaymentDatesss");
    console.log(nextPaymentDatesss);
    console.log(`Checked on  ${currentDate.toLocaleDateString("en-GB")}`);
    console.log(`Sent on ${nextPaymentDatesss.toLocaleDateString("en-GB")}`);
    if (
      currentDate.getFullYear() === nextPaymentDatesss.getFullYear() &&
      currentDate.getMonth() === nextPaymentDatesss.getMonth() &&
      currentDate.getDate() === nextPaymentDatesss.getDate()
    ) {
      console.log("here");
      console.log(
        `Checked on ${currentDate.getDate()}/ ${currentDate.getMonth()}/ ${currentDate.getFullYear()}`
      );
      console.log(
        `Sent on ${nextPaymentDatesss.getDate()}/ ${nextPaymentDatesss.getMonth()}/ ${nextPaymentDatesss.getFullYear()}`
      );
    }

    const wallet = await Wallet.findOne({ user: id });

    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    // Extract the creation date and payment interval from the request body
    const body = PaymentDateSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }
    // const { creationDate, interval } = body;

    // Parse the creation date string into a JavaScript Date object
    // const parsedCreationDate = new Date(creationDate);

    const dateParts = body.data.date.split("/");
    const parsedCreationDate = new Date(
      `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`
    );
    console.log(parsedCreationDate);

    // Calculate the next payment date based on the interval
    let nextPaymentDate;
    if (body.data.interval.toLowerCase() == "weekly") {
      nextPaymentDate = new Date(parsedCreationDate);
      console.log(nextPaymentDate);
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
      console.log(nextPaymentDate.getDate() + 7);
    } else if (body.data.interval.toLowerCase() == "monthly") {
      nextPaymentDate = new Date(parsedCreationDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    rent.next_date = `${nextPaymentDate.getDate()}/${
      nextPaymentDate.getMonth() + 1
    }/${nextPaymentDate.getFullYear()}`;
    await spaceRents[rent].save();

    // Format the next payment date as a string
    const formattedNextPaymentDate = `${nextPaymentDate.getDate()}/${
      nextPaymentDate.getMonth() + 1
    }/${nextPaymentDate.getFullYear()}`;

    // Send the next payment date as a response
    res.json({ nextPaymentDate: formattedNextPaymentDate });
  } catch (error) {
    console.log(" NEXT PAYMENT DATE ERROR=>", error);
    res.status(400).json({
      errors: [
        {
          error: error.message,
        },
      ],
    });
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.createRentPayment = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const userinfo = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  }
  const body = PaymentSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  try {
    const wallet = await Wallet.findOne({ user: id });
    const rent = await SpaceRent.findOne({ user: id });

    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    if (!rent) return res.status(400).json({ error: "Rent not found" });
    const referenceId = "REN" + getRandom(6) + rent.rentspace_id;
    const paymentOrder = await Payment.create({
      user: id,
      reference: referenceId,
      ...body.data,
    });

    const totalAmount = parseFloat(rent.amount); // Total amount entered by the user
    const intervalAmount = parseFloat(body.data.amount); // Interval amount entered by the user

    // Calculate 70% of the total amount
    const seventyPercent = 0.7 * totalAmount;

    // Calculate 1% of 70% of the total amount
    const onePercentOfSeventyPercent = 0.01 * seventyPercent;

    // Calculate the final amount to be charged
    const finalAmount = intervalAmount + onePercentOfSeventyPercent;

    const paymentData = {
      email: body.data.email,
      amount: finalAmount,
      country: "NG",
      currency: "NGN",
      payment_methods: body.data.payment_methods,
      merchant_reference: referenceId,
      callback_url: process.env.CALLBACK_URL,
      wallet_id: process.env.RENT_WALLET_ID,
    };

    const watuPaymentAPIResponse = await axios.post(
      process.env.INITIATE_PAYMENT,
      paymentData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );
    console.log(paymentData);
    console.log("Watu API Response=>", watuPaymentAPIResponse.data);
    // const transactionId = watuPaymentAPIResponse.data.transactionId;
    // const message = watuPaymentAPIResponse.data.message;

    if (watuPaymentAPIResponse.data.has_error == false) {
      paymentOrder.status_code = watuPaymentAPIResponse.data.status_code;
      paymentOrder.transactionId =
        watuPaymentAPIResponse.data.data.transaction_id;
      paymentOrder.reference = referenceId;
      paymentOrder.message = watuPaymentAPIResponse.data.message;
      paymentOrder.status = "Initiated";
      await paymentOrder.save();
      return res.status(200).json({ message: watuPaymentAPIResponse.data });
    } else if (watuPaymentAPIResponse.data.has_error == true) {
      paymentOrder.reference = referenceId;
      // paymentOrder.transactionId = watuPaymentAPIResponse.transactionId;
      paymentOrder.status_code = watuPaymentAPIResponse.data.status_code;
      paymentOrder.status = "Failed";

      await paymentOrder.save();
      return res.status(400).json({ message: watuPaymentAPIResponse.data });
    }
  } catch (error) {
    console.error("PAYMENT ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.webhooks = async (req, res) => {
  const webhookData = req.body;
  console.log("webhookData");
  console.log(webhookData);
  const merchantRef =
    webhookData.merchant_ref || webhookData.merchant_reference;
  const webhookFeature = webhookData.feature;
  let collectionName;

  // Determine transaction type based on the transaction reference
  if (merchantRef) {
    if (merchantRef.startsWith("REN")) {
      collectionName = WebhookRent;
    } else if (merchantRef.startsWith("WAL")) {
      collectionName = WebhookWallet;
    } else if (merchantRef.startsWith("RentSTRF")) {
      collectionName = WebhookDVA;
    } else if (merchantRef.startsWith("TRF")) {
      collectionName = WebhookWithdrawal;
    } else if (webhookFeature == "Bills Payment") {
      collectionName = WebhookUtility;
    } else {
      collectionName = Webhook;
    }
  } else {
    collectionName = Webhook;
  }
  try {
    const newWebhook = new collectionName(webhookData);
    console.log(newWebhook);
    // Save the new instance to the database
    await newWebhook.save();
    // Route the transaction to the appropriate processing function
    switch (collectionName) {
      case WebhookRent:
        processRentPayment(webhookData);
        break;
      case WebhookWallet:
        processWalletPayment(webhookData);
        break;
      case WebhookDVA:
        processDvaPayment(webhookData);
        break;
      case WebhookWithdrawal:
        processWalletWithdrawal(webhookData);
        break;
      case WebhookUtility:
        processUtility(webhookData);
        break;
      // case 'deposit':
      //     processDepositPayment(webhookData);
      //     break;
      // case 'tank':
      //     processTankPayment(webhookData);
      //     break;
      default:
        console.log("Unknown transaction type");
        break;
    }
    // Set up intervals for each function
    // setInterval(async () => {
    //   await processWalletPayment(webhookData);
    // }, 2 * 60 * 1000); // 2 minutes
    return res
      .status(200)
      .json({ message: `${collectionName} Funded Succesfully`, webhookData });
    // Route the transaction to the appropriate processing function
  } catch (error) {
    console.log(` ${collectionName} FUNDING ERROR=>`, error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.providusWebhook = async (req, res) => {
  console.log("Received Providus webhook data:", req.body);

  const webhookData = req.body;
  const receivedSignature = req.headers["x-auth-signature"];
  const storedSignature = process.env.PROVIDUS_X_AUTH_SIGNATURE;

  console.log("Received signature:", receivedSignature);
  console.log("Stored signature:", storedSignature);

  // Validate X-Auth-Signature
  if (receivedSignature !== storedSignature) {
    return res.status(400).json({
      requestSuccessful: false,
      responseMessage: "rejected transaction",
      responseCode: "02",
    });
  }

  try {
    console.log("Starting to process webhook data...");

    // Check Virtual Account Existence
    const user = await User.findOne({ dva_number: webhookData.accountNumber });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({
        requestSuccessful: false,
        sessionId: webhookData.sessionId,
        responseMessage: "rejected transaction",
        responseCode: "02",
      });
    }

    console.log("User found!");

    // Check Duplicate Transaction
    const isDuplicate = await ProvidusWebhook.exists({
      settlementId: webhookData.settlementId,
    });
    console.log("Is duplicate:", isDuplicate);

    if (isDuplicate) {
      return res.status(200).json({
        requestSuccessful: true,
        sessionId: webhookData.sessionId,
        responseMessage: "duplicate transaction",
        responseCode: "01",
      });
    }

    console.log("No duplicate transaction found!");

    // Store the webhook data
    const newWebhook = new ProvidusWebhook(webhookData);
    await newWebhook.save();

    console.log("Stored webhook data in database!");

    // Process the Transaction and Update User Record
    await processTransactionAndUpdateUser(webhookData, user);

    console.log("Updated user record!");

    // // Handle notifications
    // const fundingDescription = webhookData.tranRemarks.split("FROM")[1];
    const sourceAccount = req.body.sourceAccountName;
    await handlePushNotification(
      user,
      webhookData.transactionAmount,
      sourceAccount
    );

    console.log("Sent push notification!");

    // Send email notification
    await sendEmailNotification(
      user,
      webhookData.transactionAmount,
      sourceAccount
    );

    console.log("Sent email notification!");

    // Respond with success message
    return res.status(200).json({
      requestSuccessful: true,
      sessionId: webhookData.sessionId,
      responseMessage: "success",
      responseCode: "00",
    });
  } catch (error) {
    console.error("Error processing webhook data:", error);

    return res.status(500).json({
      requestSuccessful: false,
      sessionId: webhookData.sessionId,
      responseMessage: "server error",
      responseCode: "03",
    });
  }
};

async function processTransactionAndUpdateUser(webhookData, user) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await Wallet.findOne({ user: user._id }).session(session);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Update wallet main balance
    wallet.mainBalance += parseFloat(webhookData.transactionAmount);
    await wallet.save({ session });

    //update spacePoint
    const spacePoint = addSpacePointOnUserInflow(webhookData.transactionAmount);
    user.utility_points += spacePoint;
    await user.save({ session });

    // Create a new WalletHistory document
    const walletHistory = new WalletHistory({
      user: user._id,
      transactionReference: webhookData.settlementId,
      transactionType: "Credit",
      transactionGroup: "Virtual Account Funding",
      amount: parseFloat(webhookData.transactionAmount),
      currency: webhookData.currency,
      fees: parseFloat(webhookData.feeAmount),
      totalAmount: parseFloat(webhookData.settledAmount),
      merchantReference:
        webhookData.merchantRef || webhookData.merchant_reference,
      status: "Success",
      message: webhookData?.tranRemarks,
      paymentGateway: "providus",
      accountName: webhookData?.sourceAccountName,
      accountNumber: webhookData?.sourceAccountNumber,
      bankName: webhookData?.sourceBankName,
    });

    // Save the WalletHistory document
    await walletHistory.save({ session });

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    // Abort the transaction in case of error
    await session.abortTransaction();
    console.error("Error processing transaction and updating user:", error);
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
}

async function handlePushNotification(user, amount, sourceAccount) {
  const fcmToken = await FCMToken.findOne({ user: user._id });
  console.log("Sending push notification for user", user._id);
  console.log("FCM Token:", fcmToken);
  if (fcmToken && fcmToken.token) {
    const message = {
      notification: {
        title: "Account Credited Successfully",
        body: `Your Rentspace Account has been credited with ₦${amount} from ${sourceAccount}`,
      },
      data: {
        notificationType: "payment",
        amount: amount.toString(),
        name: sourceAccount,
      },
      token: fcmToken.token,
    };
    console.log("Message to be sent:", message);
    getMessaging()
      .send(message)
      .then(
        (response) => {
          console.log("Push notification sent successfully");
        },
        (error) => {
          console.error("Error sending push notification:", error);
        }
      );
  }
}

async function sendEmailNotification(user, amount, fundingDescription) {
  try {
    const newDate = new Date();
    const localDate = newDate.toLocaleString("en-GB", {
      timeZone: "Africa/Lagos",
    });
    console.log(localDate);
    // Generate the HTML content for the email
    const emailContent = walletFunding(
      user.userName,
      amount,
      fundingDescription,
      localDate
    );

    // Set up the email data
    const emailData = {
      to: user.email,
      subject: "Account Credited Successfully",
      html: emailContent,
    };

    console.log(emailData);
    // Send the email
    await sendEmail(emailData);
  } catch (error) {
    console.error("Error sending email notification:", error);
    throw error;
  }
}

exports.getWebhooks = async (req, res) => {
  try {
    const webhooks = await Webhook.find();
    res.status(200).json({
      webhooks,
    });
  } catch (error) {
    console.log("GET ALL WEBHOOKS  ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

async function processDvaPayment(data) {
  // Extract necessary information from the webhook data
  const {
    feature,
    feature_id,
    status,
    message,
    transaction_reference,
    merchant_reference,
    date_created,
    payment_data,
    description,
    transaction_group,
    bank_account,
    remarks,
  } = data;

  // Log the received wallet payment data
  console.log("Received wallet payment:");
  console.log("Feature:", feature);
  console.log("Feature ID:", feature_id);
  console.log("Status:", status);
  console.log("Message:", message);
  console.log("Transaction Reference:", transaction_reference);
  console.log("Transaction Group:", transaction_group);
  console.log("Merchant Reference:", merchant_reference);
  console.log("Date Created:", date_created);
  console.log("Description:", description);
  console.log("Remarks:", remarks);
  console.log("Bank Account:", bank_account);

  // Extract payment data specific to wallet payments
  const { currency, amount, fees, total_amount } = payment_data;
  const { account } = bank_account;
  const { account_id, account_name } = account;

  // Log the payment details
  console.log("Payment Data:");
  console.log("Currency:", currency);
  console.log("Amount:", amount);
  console.log("Fees:", fees);
  console.log("Total Amount:", total_amount);
  console.log("Account Id", account_id);
  console.log("Account Name", account_name);

  try {
    const dva_number = account_id;

    // Find the user by DVA number
    const user = await User.findOne({ dva_number: dva_number });

    if (!user) {
      throw new Error("User not found");
    }
    const fcmToken = await FCMToken.findOne({ user: user._id });
    // Find the wallet associated with the user
    const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet) {
      throw new Error("Wallet not found");
    }
    // if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    // const { amount } = body.data;
    wallet.mainBalance += parseFloat(amount);

    await wallet.save();

    // Create a new WalletHistory document
    const walletHistory = new WalletHistory({
      user: wallet.user, // Assuming 'user' field is populated in Wallet model
      transactionReference: transaction_reference,
      transactionType: "Credit",
      amount: amount,
      currency: currency,
      fees: "0",
      totalAmount: total_amount,
      merchantReference: merchant_reference,
      status: status,
      message: "Wallet Funding Through DVA",
      transactionGroup: transaction_group,
      description: description,
      remarks: remarks,
      // Add other fields as needed
    });

    // Save the WalletHistory document
    await walletHistory.save();

    if (status.toLowerCase() == "completed") {
      if (fcmToken.token) {
        console.log(fcmToken.token);
        const fundingDescription = description.split("from")[1];
        const message = {
          notification: {
            title: "Account Credited Successfully",
            body: `Your Rentspace Account has been credited with ₦${amount} from ${fundingDescription}`,
          },
          data: {
            notificationType: "payment", // Add a parameter to specify the type of notification
            amount: amount,
            name: fundingDescription,
          },
          token: fcmToken.token,
        };
        getMessaging().send(message);
      }
    }

    // Generate the HTML content for the email
    const emailContent = walletFunding(
      user.userName,
      amount,
      description,
      date_created
    );

    // Set up the email data
    const emailData = {
      to: user.email,
      subject: "Account Credited Successfully",
      html: emailContent,
    };

    // Send the email
    await sendEmail(emailData);

    // const
    const activity = new Activities({
      user: wallet.user._id,
      activityType: "DVA Wallet Funding",
      description: "Space Wallet Funded Through DVA",
    });
    await activity.save();
    // Return the result to the caller (usually the route handler)
    return { success: true, message: "DVA Wallet funded successfully", wallet };
    // return res
    //   .status(200)
    //   .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log("DVA WALLET FUNDING ERROR:", error);
    // Return the error to the caller (usually the route handler)
    return {
      success: false,
      message: "Failed to fund DVA wallet",
      error: error.message,
    };
  }
}

async function processWalletPayment(data) {
  // Extract necessary information from the webhook data
  const {
    feature,
    feature_id,
    status,
    message,
    transaction_reference,
    merchant_reference,
    date_created,
    payment_data,
    description,
    transaction_group,
  } = data;

  // Log the received wallet payment data
  console.log("Received wallet payment:");
  console.log("Feature:", feature);
  console.log("Feature ID:", feature_id);
  console.log("Status:", status);
  console.log("Message:", message);
  console.log("Transaction Reference:", transaction_reference);
  console.log("Merchant Reference:", merchant_reference);
  console.log("Date Created:", date_created);
  console.log("Description:", description);
  console.log("Transaction Group:", transaction_group);

  // Extract payment data specific to wallet payments
  const { currency, amount, fees, total_amount } = payment_data;

  // Log the payment details
  console.log("Payment Data:");
  console.log("Currency:", currency);
  console.log("Amount:", amount);
  console.log("Fees:", fees);
  console.log("Total Amount:", total_amount);

  try {
    const webhook_wallet_id = merchant_reference.substring(7);
    const wallet = await Wallet.findOne({ walletId: webhook_wallet_id });
    if (!wallet) throw new Error("Wallet not found");
    // if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    // const { amount } = body.data;
    wallet.mainBalance += parseFloat(amount);

    await wallet.save();
    const walletHistory = await WalletHistory.findOneAndUpdate(
      { merchantReference: merchant_reference },
      {
        $set: {
          description: description || "Failed Transfer",
          status: status,
          message: message,
          // sessionId: transaction_reference,
          transactionGroup: transaction_group,
        },
      },
      { new: true }
    );

    // Create a new WalletHistory document
    //  const walletHistory = new WalletHistory({
    //     user: wallet.user, // Assuming 'user' field is populated in Wallet model
    //     transactionReference: transaction_reference,
    //     amount: amount,
    //    currency: currency,
    //    transactionType:'Credit',
    //    fees: '0',
    //      totalAmount: total_amount,
    //     merchantReference:merchant_reference,
    //     status: status,
    //    message: message,
    //     description:'Wallet Funding Through Card Payment'
    //     // Add other fields as needed
    // });

    // Save the WalletHistory document
    await walletHistory.save();
    // const
    const activity = new Activities({
      user: wallet.user._id,
      activityType: "Wallet Funding",
      description: "Space Wallet Funded",
    });
    await activity.save();
    // Return the result to the caller (usually the route handler)
    return { success: true, message: "Wallet funded successfully", wallet };
    // return res
    //   .status(200)
    //   .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log("WALLET FUNDING ERROR:", error);
    // Return the error to the caller (usually the route handler)
    return {
      success: false,
      message: "Failed to fund wallet",
      error: error.message,
    };
  }
}

async function processRentPayment(data) {
  // Extract necessary information from the webhook data
  const {
    feature,
    feature_id,
    status,
    message,
    transaction_reference,
    merchant_reference,
    date_created,
    payment_data,
    description,
  } = data;

  // Log the received wallet payment data
  console.log("Received Rent payment:");
  console.log("Feature:", feature);
  console.log("Feature ID:", feature_id);
  console.log("Status:", status);
  console.log("Message:", message);
  console.log("Transaction Reference:", transaction_reference);
  console.log("Merchant Reference:", merchant_reference);
  console.log("Date Created:", date_created);
  console.log("Description:", description);

  // Extract payment data specific to wallet payments
  const { currency, amount, fees, total_amount } = payment_data;

  // Log the payment details
  console.log("Payment Data:");
  console.log("Currency:", currency);
  console.log("Amount:", amount);
  console.log("Fees:", fees);
  console.log("Total Amount:", total_amount);

  try {
    const webhook_rent_id = merchant_reference.slice(-11);
    const rent = await SpaceRent.findOne({ rentspace_id: webhook_rent_id });
    if (!rent) throw new Error("Space Rent not found");
    // if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    // const { amount } = body.data;
    // wallet.mainBalance += parseFloat(amount);
    rent.paid_amount += parseFloat(amount);
    rent.current_payment += 1;
    rent.payment_status = "Active";

    await rent.save();

    // Create a new WalletHistory document
    const rentHistory = new RentHistory({
      user: rent.user, // Assuming 'user' field is populated in Space model
      rent: rent._id,
      transactionReference: transaction_reference,
      amount: amount,
      currency: currency,
      fees: fees,
      totalAmount: total_amount,
      merchantReference: merchant_reference,
      status: status,
      message: message,
      description: description,
      // Add other fields as needed
    });

    // Save the WalletHistory document
    await rentHistory.save();

    // const
    const activity = new Activities({
      user: rent.user._id,
      activityType: "Rent Funding",
      description: "Space Rent Funded",
    });
    await activity.save();
    // Return the result to the caller (usually the route handler)
    return { success: true, message: "Rent funded successfully", rent };
    // return res
    //   .status(200)
    //   .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log("RENT FUNDING ERROR:", error);
    // Return the error to the caller (usually the route handler)
    return {
      success: false,
      message: "Failed to fund rent",
      error: error.message,
    };
  }
}

async function processWalletWithdrawal(data) {
  // Extract necessary information from the webhook data
  const {
    feature,
    feature_id,
    feature_type,
    status,
    message,
    transaction_reference,
    merchant_reference,
    date_created,
    // bill_data,
    payment_data,
    description,
    transaction_group,
  } = data;

  // Log the received wallet payment data
  console.log("Received wallet payment:");
  console.log("Feature:", feature);
  console.log("Feature Type:", feature_type);
  console.log("Feature ID:", feature_id);
  console.log("Status:", status);
  console.log("Message:", message);
  console.log("Transaction Reference:", transaction_reference);
  console.log("Merchant Reference:", merchant_reference);
  console.log("Date Created:", date_created);
  console.log("Description:", description);
  // console.log('Bill Data:', bill_data || '000000000000000');
  console.log("Transaction Group:", transaction_group);

  // Extract payment data specific to wallet payments
  const { currency, amount, fees, total_amount } = payment_data;

  // Extract the session ID
  // const sessionId = bill_data['SESSION ID'] || '000000000000000';

  // Log the payment details
  console.log("Payment Data:");
  console.log("Currency:", currency);
  console.log("Amount:", amount);
  console.log("Fees:", fees);
  console.log("Total Amount:", total_amount);

  try {
    const webhook_wallet_id = merchant_reference.substring(7);
    const wallet = await Wallet.findOne({
      walletId: webhook_wallet_id,
    }).populate("user");
    if (!wallet) throw new Error("Wallet not found");
    let walletWithdrawalHistory;
    // if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    // const { amount } = body.data;
    switch (status) {
      case "completed".toLowerCase():
        walletWithdrawalHistory = await WalletHistory.findOneAndUpdate(
          { merchantReference: merchant_reference },
          {
            $set: {
              description: description,
              status: status,
              message: message,
              // sessionId: sessionId,
              transactionGroup: transaction_group,
            },
          },
          { new: true }
        );
        // await walletWithdrawalHistory.save();
        // Generate the HTML content for the email
        const emailContent = transfer(
          wallet.user.userName,
          amount,
          wallet.mainBalance,
          description,
          date_created
        );

        // Set up the email data
        const emailData = {
          to: wallet.user.email,
          subject: "Transfer Successful",
          html: emailContent,
        };

        // Send the email
        await sendEmail(emailData);
        break;
      case "failed".toLowerCase():
        // Increment mainBalance by the amount of the failed withdrawal
        wallet.mainBalance += parseFloat(amount);
        await wallet.save();

        walletWithdrawalHistory = await WalletHistory.findOneAndUpdate(
          { merchantReference: merchant_reference },
          {
            $set: {
              description: "Failed Transfer",
              status: status,
              message: message,
              // sessionId: sessionId,
              transactionGroup: transaction_group,
            },
          },
          { new: true }
        );
        // await walletWithdrawalHistory.save();
        break;
      case "pending".toLowerCase():
        walletWithdrawalHistory = await WalletHistory.findOneAndUpdate(
          { merchantReference: merchant_reference },
          {
            $set: {
              description: "Pending Transfer",
              status: status,
              message: message,
              // sessionId: sessionId,
              transactionGroup: transaction_group,
            },
          },
          { new: true }
        );
        // await walletWithdrawalHistory.save();
        break;
      default:
        walletWithdrawalHistory = await WalletHistory.findOneAndUpdate(
          { merchantReference: merchant_reference },
          {
            $set: {
              description: "Transfer Initiated",
              status: status,
              message: message,
              // sessionId: sessionId,
              transactionGroup: transaction_group,
            },
          },
          { new: true }
        );
        // await walletWithdrawalHistory.save();
        break;
    }

    await wallet.save();
    // const
    const activity = new Activities({
      user: wallet.user._id,
      activityType: "Wallet Transfer",
      description: "Space Wallet Transfer Completed",
    });
    await activity.save();
    // Return the result to the caller (usually the route handler)
    return { success: true, message: "Wallet liquidated successfully", wallet };
    // return res
    //   .status(200)
    //   .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log("WALLET LIQUIDATION ERROR:", error);
    // Return the error to the caller (usually the route handler)
    return {
      success: false,
      message: "Failed to liquidate wallet",
      error: error.message,
    };
  }
}

async function processUtility(data) {
  const {
    feature,
    feature_id,
    feature_type,
    status,
    message,
    transaction_reference,
    merchant_reference,
    date_created,
    // bill_data,
    payment_data,
    description,
    transaction_group,
  } = data;

  console.log("Received wallet payment:");
  console.log("Feature:", feature);
  console.log("Feature Type:", feature_type);
  console.log("Feature ID:", feature_id);
  console.log("Status:", status);
  console.log("Message:", message);
  console.log("Transaction Reference:", transaction_reference);
  console.log("Merchant Reference:", merchant_reference);
  console.log("Date Created:", date_created);
  console.log("Description:", description);
  // console.log('Bill Data:', bill_data || '000000000000000');
  console.log("Transaction Group:", transaction_group);

  // Extract payment data specific to wallet payments
  const { currency, amount, fees, total_amount } = payment_data;
}
