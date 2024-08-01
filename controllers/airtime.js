const axios = require("axios");
const Airtime = require("../models/Airtime");
const User = require("../models/User");
const { AirtimeSchema } = require("../validations/airtime");
const { VFDBillPaymentSchema } = require("../validations/vfdPayment");
const { generateRequestId } = require("../helpers/airtimeRecharge");
const Wallet = require("../models/Wallet");
const UtilityHistory = require("../models/UtilityHistory");
const Activities = require("../models/Activities");
const WalletHistory = require("../models/WalletHistory");
const { calculateSpacePoint } = require("../helpers/spacePoint");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const FCMToken = require("../models/FCMToken");
const { getMessaging } = require("firebase-admin/messaging");
// // Function to calculate space points earned from recharge amount
// const calculateSpacePoint = (rechargeAmount) => {
//   // Calculate 0.5% of the recharge amount in naira
//   const earnedAmountNaira = 0.005 * rechargeAmount;

//   // Convert the earned amount in naira to space points (1 space point = 2 naira)
//   const spacePoints = earnedAmountNaira / 2;

//   return { spacePoints, earnedAmountNaira };
// };

// TO BUY AIRTIME BY USING VTPASS API
// exports.airtimeRecharge = async (req, res) => {
//   const { id } = req.user;
//   let user;
//   user = await User.findById(id);
//   if (!user) {
//     return res.status(404).json({
//       errors: [
//         {
//           error: "User not found",
//         },
//       ],
//     });
//   }
//   const wallet = await Wallet.findOne({ user: user._id });
//   if (!wallet) return res.status(404).json({ error: "Wallet not found" });
//   // if (!wallet) return res.status(400).json({ error: "Wallet not found" });
//   // const { amount } = body.data;

//   const body = AirtimeSchema.safeParse(req.body);

//   if (!body.success) {
//     return res.status(400).json({ errors: body.error.issues });
//   }
//   if (parseFloat(body.data.amount) > wallet.mainBalance) {
//     return res.status(400).json({ error: "Insufficient Balance" });
//   }
//   try {
//     let airtimeOrder = await Airtime.create({
//       user: id,
//       ...body.data,
//     });

//     const watuApiResponse = await axios.post(
//       "https://api.watupay.com/v1/watubill/vend",
//       {
//         business_signature: process.env.BUSINESS_SIGNATURE,
//         channel: body.data.network,
//         amount: body.data.amount,
//         phone_number: body.data.phoneNumber,
//         // request_id: requestId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
//         },
//       }
//     );
//     console.log("Watu Utility API Response=>", watuApiResponse.data);
//     console.log("Watu Utility API Response for error sake=>", watuApiResponse);

//     // Update the order status and transaction details in the database
//     wallet.mainBalance -= parseFloat(body.data.amount);
//     await wallet.save();
//     if (watuApiResponse.data.has_error == false) {
//       // airtimeOrder.status = watuApiResponse.data.data.status;
//       // airtimeOrder.transactionId = watuApiResponse.data.data.transaction_reference;
//       // airtimeOrder.requestId = watuApiResponse.data.data.merchant_reference;

//       airtimeOrder = await Airtime.findOneAndUpdate(
//         { user: req.user.id },
//         {
//           $set: {
//             status: watuApiResponse.data.data.status,
//             transactionId: watuApiResponse.data.data.transaction_reference,
//             requestId: watuApiResponse.data.data.merchant_reference,
//           },
//         },
//         { new: true }
//       );

//       const { spacePoints, earnedAmountNaira } = calculateSpacePoint(
//         body.data.amount
//       );
//       if (body.data.amount >= 400) {
//         user.utility_points += spacePoints;
//         wallet.availableBalance += earnedAmountNaira;
//       }
//       await wallet.save();
//       await user.save();
//       await airtimeOrder.save();

//       // calculateSpacePoints(body.data.amount);
//       const walletHistory = new WalletHistory({
//         user: wallet.user, // Assuming 'user' field is populated in Wallet model
//         amount: body.data.amount,
//         currency: "NGN",
//         transactionType: "Debit",
//         fees: 0,
//         totalAmount: body.data.amount,
//         merchantReference: watuApiResponse.data.data.merchant_reference,
//         transactionReference: watuApiResponse.data.data.transaction_reference,
//         status: watuApiResponse.data.data.status,
//         message: watuApiResponse.data.data.message,
//         description: watuApiResponse.data.data.description,
//         transactionGroup: "bill",

//         // Add other fields as needed
//       });
//       const utilityHistory = new UtilityHistory({
//         user: wallet.user, // Assuming 'user' field is populated in Space model
//         transactionReference: watuApiResponse.data.data.transaction_reference,
//         amount: watuApiResponse.data.data.payment_data.amount,
//         currency: "NGN",
//         fees: 0,
//         biller: body.data.biller,
//         totalAmount: watuApiResponse.data.data.payment_data.amount,
//         merchantReference: watuApiResponse.data.data.merchant_reference,
//         status: watuApiResponse.data.data.status,
//         message: watuApiResponse.data.data.message,
//         description: watuApiResponse.data.data.description,
//         transactionType: "bill",
//         // Add other fields as needed
//       });

//       // Save the WalletHistory document
//       await walletHistory.save();
//       await utilityHistory.save();
//     } else if (watuApiResponse.data.has_error == true) {
//       //     airtimeOrder.transactionId = watuApiResponse.data.data.transaction_reference;
//       // airtimeOrder.status = 'failed';
//       airtimeOrder = await Airtime.findOneAndUpdate(
//         { user: req.user.id },
//         {
//           $set: {
//             status: "failed",
//             transactionId: watuApiResponse.data.data.transaction_reference,
//           },
//         },
//         { new: true }
//       );
//       await airtimeOrder.save();
//     } else if (watuApiResponse.data.data.status.toLowerCase() == "failed") {
//       wallet.mainBalance -= parseFloat(body.data.amount);
//       await wallet.save();
//       const walletHistory = new WalletHistory({
//         user: wallet.user, // Assuming 'user' field is populated in Wallet model
//         amount: body.data.amount,
//         currency: "NGN",
//         transactionType: "Debit",
//         fees: 0,
//         totalAmount: body.data.amount,
//         merchantReference: watuApiResponse.data.data.merchant_reference,
//         transactionReference: watuApiResponse.data.data.transaction_reference,
//         status: watuApiResponse.data.data.status,
//         message: watuApiResponse.data.data.message,
//         description: watuApiResponse.data.data.description,
//         transactionGroup: "bill",
//         // Add other fields as needed
//       });
//       await walletHistory.save();
//     }

//     await airtimeOrder.save();
//     //TODO
//     // Send a confirmation email to the user

//     if (airtimeOrder.status === "completed") {
//       const activity = new Activities({
//         user: user._id,
//         activityType: "Bill Payment",
//         description: "Bill Payment Successful",
//       });
//       await activity.save();
//       return res.status(200).json({ message: watuApiResponse.data });
//     } else {
//       return res.status(400).json({ message: watuApiResponse.data });
//     }
//   } catch (error) {
//     console.error("RECHARGE AIRTIME ERROR=>", error);

//     res.status(500).json({
//       errors: [
//         {
//           error: "Server Error",
//         },
//       ],
//     });
//   }
// };

exports.airtimeRecharge = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.user;
    const user = await User.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        errors: [{ error: "User not found" }],
      });
    }

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Wallet not found" });
    }

    const body = AirtimeSchema.safeParse(req.body);
    if (!body.success) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ errors: body.error.issues });
    }

    if (parseFloat(body.data.amount) > wallet.mainBalance) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Insufficient Balance" });
    }

    let airtimeOrder = await Airtime.create(
      [
        {
          user: id,
          ...body.data,
        },
      ],
      { session }
    );

    const watuApiResponse = await axios.post(
      "https://api.watupay.com/v1/watubill/vend",
      {
        business_signature: process.env.BUSINESS_SIGNATURE,
        channel: body.data.network,
        amount: body.data.amount,
        phone_number: body.data.phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
        },
      }
    );

    console.log("Watu Utility API Response=>", watuApiResponse.data);

    wallet.mainBalance -= parseFloat(body.data.amount);
    await wallet.save({ session });

    if (watuApiResponse.data.has_error == false) {
      airtimeOrder = await Airtime.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            status: watuApiResponse.data.data.status,
            transactionId: watuApiResponse.data.data.transaction_reference,
            requestId: watuApiResponse.data.data.merchant_reference,
          },
        },
        { new: true, session }
      );

      const { spacePoints, earnedAmountNaira } = calculateSpacePoint(
        body.data.amount
      );
      if (body.data.amount >= 400) {
        user.utility_points += spacePoints;
        wallet.availableBalance += earnedAmountNaira;
      }
      await wallet.save({ session });
      await user.save({ session });
      await airtimeOrder.save({ session });

      const walletHistory = new WalletHistory({
        user: wallet.user,
        amount: body.data.amount,
        currency: "NGN",
        transactionType: "Debit",
        fees: 0,
        totalAmount: body.data.amount,
        merchantReference: watuApiResponse.data.data.merchant_reference,
        transactionReference: watuApiResponse.data.data.transaction_reference,
        status: watuApiResponse.data.data.status,
        message: watuApiResponse.data.data.message,
        description: watuApiResponse.data.data.description,
        transactionGroup: "bill",
      });
      const utilityHistory = new UtilityHistory({
        user: wallet.user,
        transactionReference: watuApiResponse.data.data.transaction_reference,
        amount: watuApiResponse.data.data.payment_data.amount,
        currency: "NGN",
        fees: 0,
        biller: body.data.biller,
        totalAmount: watuApiResponse.data.data.payment_data.amount,
        merchantReference: watuApiResponse.data.data.merchant_reference,
        status: watuApiResponse.data.data.status,
        message: watuApiResponse.data.data.message,
        description: watuApiResponse.data.data.description,
        transactionType: "bill",
      });

      await walletHistory.save({ session });
      await utilityHistory.save({ session });
    } else {
      airtimeOrder = await Airtime.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: {
            status: "failed",
            transactionId: watuApiResponse.data.data.transaction_reference,
          },
        },
        { new: true, session }
      );

      await airtimeOrder.save({ session });

      if (watuApiResponse.data.data.status.toLowerCase() == "failed") {
        const walletHistory = new WalletHistory({
          user: wallet.user,
          amount: body.data.amount,
          currency: "NGN",
          transactionType: "Debit",
          fees: 0,
          totalAmount: body.data.amount,
          merchantReference: watuApiResponse.data.data.merchant_reference,
          transactionReference: watuApiResponse.data.data.transaction_reference,
          status: watuApiResponse.data.data.status,
          message: watuApiResponse.data.data.message,
          description: watuApiResponse.data.data.description,
          transactionGroup: "bill",
        });
        await walletHistory.save({ session });
      }
    }

    if (airtimeOrder.status === "completed") {
      const activity = new Activities({
        user: user._id,
        activityType: "Bill Payment",
        description: "Bill Payment Successful",
      });
      await activity.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    if (airtimeOrder.status === "completed") {
      return res.status(200).json({ message: watuApiResponse.data });
    } else {
      return res.status(400).json({ message: watuApiResponse.data });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("RECHARGE AIRTIME ERROR=>", error);
    res.status(500).json({
      errors: [{ error: "Server Error" }],
    });
  }
};

// QUERY TRANSACTION STATUS
exports.queryTransactionStatus = async (req, res) => {
  try {
    const { requestId } = req.body;

    const vtPassApiUrl = process.env.VTPASS_API_URL_QUERY;
    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;

    const vtPassApiResponse = await axios.post(
      vtPassApiUrl,
      {
        request_id: requestId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": vtPassApiKey,
          "secret-key": vtPassSecretKey,
          "public-key": vtPassPublicKey,
        },
      }
    );
    console.log("VT Pass API Response=>", vtPassApiResponse.data);
    return res.status(200).json({ data: vtPassApiResponse.data });
  } catch (error) {
    console.log("TRANSACTION QUERY ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// GET ALL AIRTIME TRANSACTIONS
exports.getAllAirtimeTransactions = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("ID=>", id);
    const user = await User.findById(id);
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
    allAirtimeTransaction = await Airtime.find({ user: id }).exec();
    if (!allAirtimeTransaction) {
      return res.status(404).json({
        errors: [
          {
            error: "Airtime transactions not found",
          },
        ],
      });
    }

    return res.status(200).json({ data: allAirtimeTransaction });
  } catch (error) {
    console.log("GET ALL AIRTIME TRANSACTIONS ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.checkAirtimeCountries = async (req, res) => {
  try {
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

    // TO MAKE THE CALL TO VTPASS ENDPOINTS AND BUY THE Airtime.
    const vtPassApiUrl = process.env.VTPASS_API_URL_COUNTRIES;
    // console.log("vtPassApiUrl =>", vtPassApiUrl)

    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;

    const vtPassApiResponse = await axios.post(vtPassApiUrl, {
      headers: {
        "Content-Type": "application/json",
        "api-key": vtPassApiKey,
        "secret-key": vtPassSecretKey,
        "public-key": vtPassPublicKey,
      },
    });
    // console.log('VT Pass API Response=>', vtPassApiResponse.data);

    // Update the order status and transaction details in the database
    if (
      vtPassApiResponse.data.response_description == "TRANSACTION SUCCESSFUL"
    ) {
      airtimeOrder.status = "delivered";
      airtimeOrder.transactionId = transactionId;
      airtimeOrder.requestId = requestId;
    } else if (vtPassApiResponse.data.code == "016") {
      airtimeOrder.transactionId = transactionId;
      airtimeOrder.status = "failed";
    }

    await airtimeOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (airtimeOrder.status === "delivered") {
      return res
        .status(200)
        .json({ message: vtPassApiResponse.data.response_description });
    } else {
      return res
        .status(400)
        .json({ message: vtPassApiResponse.data.response_description });
    }
  } catch (error) {
    console.error("GET AIRTIME COUNTRIES ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// Sandbox VT Pass API Key
// 4e1612cf6892295194b7d8d5ec1fa6e3
// a703cfa0a9e561a0e34836c9b92d82ea

// Sandbox VT Pass Secret Key
// SK_97968a275cd2b734468f85b28a9880c697a0a1d768b
// SK_69273008f2539a79758f5eb344973391539534f5cce

// Sandbox VT Pass Public Key
// PK_8271aa952342fec770931cc01932d9e08fa887ff302
// PK_726f4e058d94123e9a49ad0255fad0285682bede443

// https://sandbox.vtpass.com/api/pay

/*
                                                              VFD BILL PAYMENTS



curl --location https://api-devapps.vfdbank.systems/vfd-tech/baas-portal/v1/baasauth/token \
--header "Content-Type: application/json" \
--header "Accept: application/json" \
--data '{"consumerKey" : "bFynNPTaU1F5aoWR83oMWZAndxer", "consumerSecret":"dZBlg00rfJMDLPECjjpUMrEdw0bE", "validityTime":"-1"}'



{"status":"00","message":"Successful","data":{"access_token":"eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI3MjIiLCJ0b2tlbklkIjoiZDczODk4Y2UtN2FmZC00NDJmLWI3ZDgtZDgwYTkwZWI0Mzc3IiwiaWF0IjoxNzE1MjUwNTAyLCJleHAiOjQ4Njg4NTA1MDJ9.3LJs4btKWMmSgOSSAk9s1YZFQyw1RRM-tl_4a1Z-80N1G9PhSYgwNBdv1wCqgKDQl3kWG4BXOz2aEOnrWp_RdA","scope":"am_application_scope default","token_type":"Bearer","expires_in":4868850502731}}% 

curl --location "https://api-devapps.vfdbank.systems/vtech-wallet/api/v1.1/billspaymentstore/billercategory" \
--header "AccessToken: {{eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI3MjIiLCJ0b2tlbklkIjoiYjk3ZmQ1NzktNWEyNy00Y2U4LTgxMjMtMGM1NDhiZDNmNDZkIiwiaWF0IjoxNzE1MjUwNzQzLCJleHAiOjQ4Njg4NTA3NDN9.vJUQ4binSR1x6Bk0vEg58-wS7V4dNq0HYAIZktPyeYCn9ZC7Y--PwsGInqTEtNoa07_ut7fC5cqM_19ErrK1EQ}}" \
--request GET

{"status":"00","message":"Succesfully Returned Biller Category","data":[{"category":"Utility"},{"category":"Airtime"},{"category":"Cable TV"},{"category":"Data"},{"category":"Internet Subscription"}]}% 

*/

const liveVFDBillBaseURL = process.env.VFD_LIVE_URL;

// const liveVFDBillBaseURL =
//   "https://api-devapps.vfdbank.systems/vtech-wallet/api/v1.1/billspaymentstore";

exports.VFDfetchBillerCategory = async (req, res) => {
  const accessToken = process.env.VFD_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: "Access token not provided" });
  }

  try {
    const response = await axios.get(`${liveVFDBillBaseURL}/billercategory`, {
      headers: {
        AccessToken: accessToken,
      },
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error fetching biller category:", error);
    return res.status(500).json({ error: "Error fetching biller category" });
  }
};

exports.getVFDBillerList = async (req, res) => {
  const accessToken = process.env.VFD_ACCESS_TOKEN;
  const { categoryName } = req.query;

  if (!accessToken) {
    return res.status(500).json({ error: "Access token not provided" });
  }

  try {
    const response = await axios.get(
      `${liveVFDBillBaseURL}/billerlist?categoryName=${categoryName || ""}`,
      {
        headers: {
          AccessToken: accessToken,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error fetching biller list:", error);
    return res.status(500).json({ error: "Error fetching biller list" });
  }
};

exports.getVFDBillerItems = async (req, res) => {
  const accessToken = process.env.VFD_ACCESS_TOKEN;
  const { billerId, divisionId, productId } = req.query;

  if (!accessToken) {
    return res.status(500).json({ error: "Access token not provided" });
  }

  if (!billerId || !divisionId || !productId) {
    return res.status(400).json({
      error:
        "billerId, divisionId, and productId are mandatory query parameters",
    });
  }

  try {
    const response = await axios.get(
      `${liveVFDBillBaseURL}/billerItems?billerId=${billerId}&divisionId=${divisionId}&productId=${productId}`,
      {
        headers: {
          AccessToken: accessToken,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error fetching biller items:", error);
    return res.status(500).json({ error: "Error fetching biller items" });
  }
};

const processUserSuccessfulVFDBillPayment = async (
  user,
  wallet,
  amount,
  reference,
  billerId,
  customerId
) => {
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    // Create wallet history and utility history documents
    const walletHistoryDoc = new WalletHistory({
      user: wallet.user,
      amount,
      currency: "NGN",
      transactionType: "Debit",
      fees: 0,
      totalAmount: amount,
      merchantReference: reference,
      transactionReference: reference,
      status: "Completed",
      message: `Successful ${billerId} recharge`,
      description: "Successful Bill Payment",
      transactionGroup: "bill",
      paymentGateway: "vfd",
      userUtilityNumber: customerId,
      biller: billerId,
    });

    const utilityHistoryDoc = new UtilityHistory({
      user: wallet.user,
      transactionReference: reference,
      amount,
      currency: "NGN",
      fees: 0,
      biller: billerId,
      totalAmount: amount,
      merchantReference: reference,
      status: "Completed",
      message: `Successful ${billerId} recharge`,
      description: "Successful Bill Payment",
      transactionType: "bill",
      userUtilityNumber: customerId,
    });

    // Save the created documents
    await Promise.all([
      WalletHistory.insertMany([walletHistoryDoc], { session }),
      UtilityHistory.insertMany([utilityHistoryDoc], { session }),
      // Save wallet and user
      wallet.save({ session }),
      user.save({ session }),
      // Create activity
      new Activities({
        user: user._id,
        activityType: "Bill Payment",
        description: "Bill Payment Successful",
      }).save({ session }),
    ]);

    // Commit the transaction
    await session.commitTransaction();
    console.log("Bill payment processed successfully.");
  } catch (error) {
    console.error("Error processing bill payment:", error);
    // Abort transaction on error
    await session.abortTransaction();
    throw new Error("Error processing bill payment");
  } finally {
    session.endSession();
  }
};

const processFailedVFDBillPayment = async (
  wallet,
  amount,
  reference,
  billerId,
  customerId,
  user
) => {
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    // Deduct amount from user's spacepoint balance
    user.utility_points -= parseFloat(amount);
    await user.save({ session });
    // Create wallet history and utility history documents for the failed payment
    const walletHistoryDoc = new WalletHistory({
      user: wallet.user,
      amount,
      currency: "NGN",
      transactionType: "Debit",
      fees: 0,
      totalAmount: amount,
      merchantReference: reference,
      transactionReference: reference,
      status: "Failed",
      message: `Transaction failed for ${billerId} recharge`,
      description: "Failed transaction",
      transactionGroup: "bill",
      paymentGateway: "vfd",
      userUtilityNumber: customerId,
      biller: billerId,
    });

    const utilityHistoryDoc = new UtilityHistory({
      user: wallet.user,
      transactionReference: reference,
      amount,
      currency: "NGN",
      fees: 0,
      biller: billerId,
      totalAmount: amount,
      merchantReference: reference,
      status: "Failed",
      message: `Transaction failed for ${billerId} recharge`,
      description: "Failed transaction",
      transactionType: "bill",
      userUtilityNumber: customerId,
    });

    // Save the created documents
    await Promise.all([
      WalletHistory.insertMany([walletHistoryDoc], { session }),
      UtilityHistory.insertMany([utilityHistoryDoc], { session }),
      // Save the wallet
      wallet.save({ session }),
    ]);

    // Commit the transaction
    await session.commitTransaction();
    console.log("Failed bill payment processed successfully.");
  } catch (error) {
    console.error("Error processing failed bill payment:", error);
    // Abort transaction on error
    await session.abortTransaction();
    throw new Error("Error processing failed bill payment");
  } finally {
    session.endSession();
  }
};

const processUserPendingVFDBillPayment = async (
  user,
  wallet,
  amount,
  reference,
  billerId,
  customerId
) => {
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    // Create wallet history and utility history documents
    const walletHistoryDoc = new WalletHistory({
      user: wallet.user,
      amount,
      currency: "NGN",
      transactionType: "Debit",
      fees: 0,
      totalAmount: amount,
      merchantReference: reference,
      transactionReference: reference,
      status: "Completed",
      message: `Successful ${billerId} recharge`,
      description: "Successful Bill Payment | Pending",
      transactionGroup: "bill",
      paymentGateway: "vfd",
      userUtilityNumber: customerId,
      biller: billerId,
    });

    const utilityHistoryDoc = new UtilityHistory({
      user: wallet.user,
      transactionReference: reference,
      amount,
      currency: "NGN",
      fees: 0,
      biller: billerId,
      totalAmount: amount,
      merchantReference: reference,
      status: "Completed",
      message: `Successful ${billerId} recharge`,
      description: "Successful Bill Payment | Pending",
      transactionType: "bill",
      userUtilityNumber: customerId,
    });

    // Save the created documents
    await Promise.all([
      WalletHistory.insertMany([walletHistoryDoc], { session }),
      UtilityHistory.insertMany([utilityHistoryDoc], { session }),
      // Save wallet and user
      wallet.save({ session }),
      user.save({ session }),
      // Create activity
      new Activities({
        user: user._id,
        activityType: "Bill Payment",
        description: "Bill Payment Successful",
      }).save({ session }),
    ]);

    // Commit the transaction
    await session.commitTransaction();
    console.log("Bill payment processed successfully.");
  } catch (error) {
    console.error("Error processing bill payment:", error);
    // Abort transaction on error
    await session.abortTransaction();
    throw new Error("Error processing bill payment");
  } finally {
    session.endSession();
  }
};

async function handlePushNotification(user, spacePoints) {
  const fcmToken = await FCMToken.findOne({ user: user._id }).lean();
  if (fcmToken?.token) {
    console.log(fcmToken);
    const message = {
      notification: {
        title: "Space Points Awarded",
        body: `Congratulations! You have been awarded ${spacePoints} space points.`,
      },
      data: {
        notificationType: "spacePoints",
        spacePoints: spacePoints.toString(),
      },
      token: fcmToken.token,
    };

    console.log("Sending push notification...");
    console.log("Message:", message);

    try {
      getMessaging().send(message);
      console.log("Push notification sent successfully");
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  } else {
    console.log("FCM token not found for user:", user._id);
  }
}

exports.payVFDBill = async (req, res) => {
  const { id } = req.user;

  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    const [user, wallet] = await Promise.all([
      User.findById(id).session(session),
      Wallet.findOne({ user: id }).session(session),
    ]);

    if (!user || !wallet) {
      await session.abortTransaction();
      return res.status(404).json({ error: "User or Wallet not found" });
    }

    const { customerId, amount, division, paymentItem, productId, billerId } =
      VFDBillPaymentSchema.parse(req.body);

    const accessToken = process.env.VFD_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({ error: "Access token not provided" });
    }

    if (parseFloat(amount) > user.utility_points) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Insufficient spacePoint balance" });
    }

    // Deduct amount from user's spacepoint balance
    user.utility_points -= parseFloat(amount);
    await user.save({ session });
    const reference = `RentSpace-${uuidv4()}`;
    console.log({ reference });

    // Commit the transaction before moving to the next step
    await session.commitTransaction();
    session.endSession();

    const [response, spacePointsObj] = await Promise.all([
      axios.post(
        `${liveVFDBillBaseURL}/pay`,
        {
          customerId,
          amount,
          division,
          paymentItem,
          productId,
          billerId,
          reference,
        },
        {
          headers: { AccessToken: accessToken },
        }
      ),
      amount >= 400
        ? calculateSpacePoint(amount)
        : { spacePoints: 0, earnedAmountNaira: 0 },
    ]);

    if (response.data.status === "00") {
      // Successful payment
      await processUserSuccessfulVFDBillPayment(
        user,
        wallet,
        amount,
        reference,
        billerId,
        customerId
      );
      // await handlePushNotification(user, spacePointsObj.spacePoints);
    } else if (response.data.status === "99") {
      // Failed payment
      await processFailedVFDBillPayment(
        wallet,
        amount,
        reference,
        billerId,
        customerId,
        user
      );
    } else if (response.data.status === "09") {
      //pending
      // Save the records with the data coming back for all other status codes
      //also deduct moneny from wallet here

      //so create a function that handles the pending response
      await processUserPendingVFDBillPayment(
        user,
        wallet,
        amount,
        reference,
        billerId,
        customerId
      );
      // await handlePushNotification(user, spacePointsObj.spacePoints);
    } else {
      // Handle unexpected status codes
      console.warn("Unexpected response status:", response.data.status);
      return res.status(400).json({
        error: "Unexpected response from bill payment service",
        details: response.data,
      });
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error paying bill:", error);
    return res.status(500).json({ error: "Error paying bill" });
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

exports.validateVFDCustomer = async (req, res) => {
  const accessToken = process.env.VFD_ACCESS_TOKEN;
  const { customerId, divisionId, paymentItem, billerId } = req.body;

  if (!accessToken) {
    return res.status(500).json({ error: "Access token not provided" });
  }

  if (!customerId || !divisionId || !paymentItem || !billerId) {
    return res.status(400).json({
      error:
        "customerId, divisionId, paymentItem, and billerId are mandator parameters",
    });
  }

  try {
    const response = await axios.get(
      `${liveVFDBillBaseURL}/customervalidate?divisionId=${divisionId}&paymentItem=${paymentItem}&customerId=${customerId}&billerId=${billerId}`,
      {
        headers: {
          AccessToken: accessToken,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error validating customer:", error);
    return res.status(500).json({ error: "Error validating customer" });
  }
};

exports.getVFDTransactionStatus = async (req, res) => {
  const accessToken = process.env.VFD_ACCESS_TOKEN;
  const { transactionId } = req.query;

  if (!accessToken) {
    return res.status(500).json({ error: "Access token not provided" });
  }

  if (!transactionId) {
    return res.status(400).json({
      error: "Transaction ID is required",
    });
  }

  try {
    const response = await axios.get(
      `${liveVFDBillBaseURL}/transactionStatus?transactionId=${transactionId}`,
      {
        headers: {
          AccessToken: accessToken,
        },
      }
    );

    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return res.status(500).json({ error: "Error fetching transaction status" });
  }
};

/*
i get this error sometimes
  cause: Error: getaddrinfo ENOTFOUND api-devapps.vfdbank.systems
      at GetAddrInfoReqWrap.onlookup [as oncomplete] (node:dns:107:26) {
    errno: -3008,
    code: 'ENOTFOUND',
    syscall: 'getaddrinfo',
    hostname: 'api-devapps.vfdbank.systems'
  }
}


*/
