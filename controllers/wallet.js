const axios = require("axios");
const mongoose = require("mongoose");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const {
  WalletSchema,
  FundWalletSchema,
  ChangePinSchema,
  ResetPinSchema,
  VerifyOtpPinSchema,
  SetPinSchema,
  WalletWithdrawalSchema,
  ProvidusWithdrawalSchema,
  ProvidusTransferSchema,
} = require("../validations/wallet");
const { encrypt, compare } = require("../helpers/auth");
const { generateOTP } = require("../helpers/token");
const { badRequest, notFound } = require("../helpers/error");
const verifyOTP = require("../helpers/verifyOtp");
const sendEmail = require("../services/email");
const {
  createAccountOtp,
  resetPasswordOtp,
  resetPinMailOTP,
} = require("../helpers/mails/emailTemplates");
const { getSecondsBetweenTime, timeDifference } = require("../helpers/date");
const { createUserWallet } = require("../services/wallet");
// const WalletWithdrawalHistory = require("../models/WalletWithdrawalHistory");
const Activities = require("../models/Activities");
const { generateRandomAlphanumeric } = require("../helpers/airtimeRecharge");
const WalletHistory = require("../models/WalletHistory");
const UserBeneficiary = require("../models/UserRecentBeneficiaries");
const DVA = require("../models/DVA");
const Providus = require("../models/ProvidusAcc");
const { transfer } = require("../helpers/mails/emailTemplates");
const { addTrxToQueue } = require("../queues/transactionQueue");
// THIS WALLET CONTROLLER SHOULD BE TRIGGERED AS SOON AS THE USER IS CREATED

exports.createWallet = async (req, res) => {
  try {
    const { id } = req.user;

    const createdWallet = await createUserWallet(id, res);
    res
      .status(200)
      .json({ message: "Wallet Created Succesully", createdWallet });
  } catch (error) {
    console.log("WALLET CREATION=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

//TO CREATE PIN FOR THE WALLET
exports.createPin = async (req, res) => {
  const { id } = req.user;
  const body = WalletSchema.safeParse(req.body);
  let user = await User.findById(id);

  if (!body.success) return res.status(400).json({ error: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    if (wallet.isPinSet) {
      // return res.status(400).json({ error: "Pin was already set" });
      return badRequest(res, "Pin was already set");
    } else {
      const { pin } = body.data;
    }

    if (!wallet.isPinSet) {
      const hashedPin = await encrypt(body.data.pin);
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {
            pin: body.data.pin,
            isPinSet: true,
          },
        },
        { new: true }
      );
      wallet.pin = hashedPin;
      wallet.isPinSet = true;
      await wallet.save();
      await user.save();
      return res
        .status(200)
        .json({ message: "Pin Created Succesfully", wallet });
    }
  } catch (error) {
    console.log("PIN CREATION ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

//CHANGE PIN
exports.changePin = async (req, res) => {
  const { id } = req.user;
  let user = await User.findById(id);
  const body = ChangePinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    const { currentPin, newPin } = body.data;
    const hashedPin = await encrypt(newPin);
    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          pin: newPin,
        },
      },
      { new: true }
    );
    wallet.pin = hashedPin;
    await user.save();
    await wallet.save();
    return res.status(200).json({ message: "Pin Changed Succesfully", wallet });
  } catch (error) {
    console.log("CHANGE WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// RESET PIN
exports.resetPinOTP = async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const user = await User.findById(id);
  const body = ResetPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const email = user.email;

    const otpValue = generateOTP();

    const otp = await encrypt(otpValue);

    const userWallet = new Wallet({
      ...body.data,
      email,
      otp,
      otpExpireIn: new Date().getTime() + 5 * 60 * 1000, // To expire in 30 minutes.
    });

    const data = {
      to: email,
      text: "RENTSPACE RESET PIN OTP Verification",
      subject: "Kindly Verify Your RESET PIN OTP",
      html: resetPinMailOTP(otpValue),
    };
    await sendEmail(data);

    wallet.otp = otp;
    wallet.otpExpireIn = new Date().getTime() + 5 * 60 * 1000;
    await wallet.save();
    return res.status(200).json({ message: "Reset PIN OTP sent", wallet });
  } catch (error) {
    console.log("CHANGE WALLET OTP ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// RESEND PIN OTP
exports.resendPinOTP = async (req, res) => {
  console.log(req.user);
  const { id, email } = req.user;
  console.log(id);
  const user = await User.findById(id);
  // const { email } = req.body;

  try {
    // const user = await User.findOne({ email });

    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    if (wallet.otp) {
      // Clear the already existing otp and create another one.
      wallet.otp = undefined;
      wallet.otpExpireIn = undefined;
      await wallet.save();
    }
    // Generate a new OTP
    const newOTP = generateOTP();
    const otp = await encrypt(newOTP);

    // Update user's OTP and OTP expiration
    wallet.otp = otp;
    wallet.otpExpireIn = new Date().getTime() + 5 * 60 * 1000;
    await wallet.save();

    // Send the new verification code to the user
    const data = {
      to: email,
      text: "RentSpace resend PIN OTP",
      subject: "Kindly Verify Your PIN OTP",
      html: resetPinMailOTP(newOTP),
    };
    await sendEmail(data);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// VERIFY RESET PIN OTP
exports.verifyResetPinOTP = async (req, res) => {
  const { id } = req.user;
  const body = VerifyOtpPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const { otp } = body.data;

    if (!(await compare(otp, wallet.otp))) {
      return badRequest(res, "Invalid OTP");
    }
    if (getSecondsBetweenTime(wallet.otpExpireIn) > timeDifference["2m"]) {
      return badRequest(res, "This otp has expired");
    }

    wallet.isPinSet = false;
    await wallet.save();
    return res.status(200).json({ message: "Reset OTP verified", wallet });
  } catch (error) {
    console.log("VERIFY WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// SET NEW PIN
exports.setNewPin = async (req, res) => {
  const { id } = req.user;
  let user = await User.findById(id);
  const body = SetPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    const { newPin, confirmNewPin } = body.data;
    if (newPin !== confirmNewPin) {
      return badRequest(res, "New pin and confirm pin do not match");
    }
    const hashedPin = await encrypt(newPin);

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          pin: newPin,
        },
      },
      { new: true }
    );
    wallet.isPinSet = true;
    wallet.pin = hashedPin;
    await user.save();
    await wallet.save();
    return res.status(200).json({ message: "Pin Changed Succesfully", wallet });
  } catch (error) {
    console.log("CHANGE WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// TO FUND THE WALLET
exports.fundWallet = async (req, res) => {
  const { id } = req.user;
  const body = FundWalletSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const { amount } = body.data;
    wallet.mainBalance = wallet.mainBalance + amount;
    await wallet.save();
    return res
      .status(200)
      .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log(" WALLET FUNDING ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// GET USER WALLET
exports.getUserWallet = async (req, res) => {
  const { id } = req.user;

  try {
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
    const wallet = await Wallet.findOne({ user: id })
      .populate("user", "-password")
      .exec();
    if (!wallet) return res.status(400).json({ error: "No wallet Found" });

    return res
      .status(200)
      .json({ msg: "Wallet Info Successfully Fetched", wallet });
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

// TO GET ALL WALLETS
exports.getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate("user", "-password");
    const totalAmountAggregate = await Wallet.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$mainBalance" },
        },
      },
    ]);
    // Extract the total amount from the aggregation result
    const totalAmount =
      totalAmountAggregate.length > 0 ? totalAmountAggregate[0].totalAmount : 0;
    res.status(200).json({
      wallets,
      totalAmount,
    });
  } catch (error) {
    console.log("GET ALL WALLETS ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

const WALLET_API_URL = process.env.WALLET_API_URL;
const API_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
};

async function getReferenceId(wallet) {
  return "TRF" + generateRandomAlphanumeric(4) + wallet.walletId;
}

async function prepareWithdrawalData(body, withdrawalAmount, referenceId) {
  return {
    amount: withdrawalAmount,
    account_id: body.data.accountNumber,
    financial_institution: body.data.bank_code,
    currency: "NGN",
    watu_pin: process.env.TRANSFER_PIN,
    async: false,
    merchant_reference: referenceId,
    wallet_id: process.env.DEFAULT_WALLET_ID,
  };
}

async function makeWithdrawalRequest(withdrawalData, session) {
  return axios.post(WALLET_API_URL, withdrawalData, { headers: API_HEADERS });
}

async function createWithdrawalHistory(userId, body, referenceId, session) {
  const withdrawalHistory = new WalletHistory({
    user: userId,
    transactionType: "Debit",
    amount: body.data.amount,
    description: `Space Wallet Withdrawal to ${body.data.accountNumber}`,
    merchantReference: referenceId,
  });

  await withdrawalHistory.save({ session });

  return withdrawalHistory;
}

async function updateWallet(wallet, totalWithdrawalAmount, session) {
  console.log("trying to subtract amount here");
  console.log("amounts here: ", wallet.mainBalance, totalWithdrawalAmount);
  wallet.mainBalance -= totalWithdrawalAmount;
  console.log("main balance here:", wallet.mainBalance);
  await wallet.save({ session });
}

async function handleWithdrawalResponse(
  walletWithdrawalResponse,
  body,
  withdrawalHistory,
  session
) {
  if (walletWithdrawalResponse.data.has_error === false) {
    withdrawalHistory.transactionReference =
      walletWithdrawalResponse.data.data.transaction_reference;
    withdrawalHistory.description = `Space Wallet Withdrawal to ${body.data.accountNumber}`;
    withdrawalHistory.message = walletWithdrawalResponse.data.message;
    withdrawalHistory.amount = parseFloat(
      walletWithdrawalResponse.data.data.payment_data.amount
    ).toString();
    withdrawalHistory.fees = "20";
    withdrawalHistory.totalAmount =
      walletWithdrawalResponse.data.data.payment_data.total_amount;
    withdrawalHistory.merchantReference =
      walletWithdrawalResponse.data.data.merchant_reference;
  } else {
    withdrawalHistory.status = "Failed";
    withdrawalHistory.message = walletWithdrawalResponse.data.message;
    withdrawalHistory.description = walletWithdrawalResponse.data.message;
  }
  await withdrawalHistory.save({ session });
}

async function saveUserBeneficiary(userId, accountNumber, bankCode, session) {
  try {
    const userBeneficiaryData = {
      userId: userId,
      accountNumber: accountNumber,
      bankCode: bankCode,
    };

    const userBeneficiary = new UserBeneficiary(userBeneficiaryData);
    await userBeneficiary.save({ session });
  } catch (error) {
    throw new Error("Error saving user beneficiary: " + error.message);
  }
}

exports.walletWithdrawal = async (req, res) => {
  const { id } = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = WalletWithdrawalSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }

    const wallet = await Wallet.findOne({ user: id }).session(session);
    if (!wallet) {
      return res.status(400).json({ error: "Wallet not found" });
    }

    const { pin } = body.data;
    if (!(await compare(pin, wallet.pin))) {
      return res.status(400).json({ error: "Incorrect PIN" });
    }

    const referenceId = await getReferenceId(wallet);

    const withdrawalAmount = parseFloat(body.data.amount);
    const totalWithdrawalAmount = withdrawalAmount + 20;

    if (totalWithdrawalAmount > wallet.mainBalance) {
      return res.status(400).json({ error: "Insufficient Balance" });
    }

    const withdrawalData = await prepareWithdrawalData(
      body,
      withdrawalAmount,
      referenceId
    );

    console.log("about to update wallet for transfer");
    await updateWallet(wallet, totalWithdrawalAmount, session);
    const withdrawalResponse = await makeWithdrawalRequest(
      withdrawalData,
      session
    );

    const withdrawalHistory = await createWithdrawalHistory(
      req.user.id,
      body,
      referenceId,
      session
    );

    await saveUserBeneficiary(
      req.user.id,
      body.data.accountNumber,
      body.data.bank_code,
      session
    );

    await handleWithdrawalResponse(
      withdrawalResponse,
      body,
      withdrawalHistory,
      session
    );

    if (withdrawalResponse.data.status_code === 200) {
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        message: "Wallet Liquidated Successfully",
        withdrawal: withdrawalResponse.data,
      });
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Wallet Liquidation error",
        withdrawal: withdrawalResponse.data,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

//=====================================================================================================PROVIDUS WALLET TRANSFER👇🏽👇🏽 ========================================================================================================================//

const processProvidusSuccessfulUserPayment = async (
  wallet,
  body,
  referenceId,
  withdrawalResponse,
  withdrawalAmount
) => {
  const session = await mongoose.startSession();
  let withdrawalHistory;

  try {
    console.log(
      "Starting user payment processing with reference ID:",
      referenceId
    );

    // Start transaction
    session.startTransaction();

    // Update wallet balance
    const totalWithdrawalAmount =
      withdrawalAmount + 20;
    console.log("Total withdrawal amount with fees:", totalWithdrawalAmount);

    // Update lastWithdrawalDate and nextWithdrawalDate after successful withdrawal
    const currentDate = new Date();
    console.log("Updating wallet last withdrawal date to: ", currentDate);
    wallet.lastWithdrawalDate = currentDate;

    const thirtyDaysLater = new Date(wallet.lastWithdrawalDate);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    console.log("Updating wallet next withdrawal date to: ", thirtyDaysLater);
    wallet.nextWithdrawalDate = thirtyDaysLater;

    // Create withdrawal history and modify it
    withdrawalHistory = new WalletHistory({
      user: wallet.user,
      amount: withdrawalAmount,
      currency: "NGN",
      transactionType: "Debit",
      description: `Space Wallet Withdrawal to ${body?.data?.beneficiaryAccountNumber}`,
      merchantReference: referenceId,
      transactionGroup: "transfer",
      status:
        withdrawalResponse?.data?.responseCode === "00" ? "Success" : "Failed",
      message: withdrawalResponse?.data?.responseMessage,
      transactionReference: withdrawalResponse?.data?.transactionReference,
      fees: "20",
      totalAmount: totalWithdrawalAmount.toString(),
      paymentGateway: "providus",
      accountName: body.data.beneficiaryAccountName,
      accountNumber: body.data.beneficiaryAccountNumber,
      bankName: body.data.beneficiaryBank,
      remarks: body.data.narration || ""
    });

    console.log("Withdrawal history created:", withdrawalHistory);

    // Save wallet and withdrawal history
    await Promise.all([
      WalletHistory.insertMany([withdrawalHistory], { session }),
      wallet.save({ session }),
    ]);

    console.log("Wallet and withdrawal history saved successfully");

    // Commit transaction
    await session.commitTransaction();

    return withdrawalHistory;
  } catch (error) {
    console.error("Error processing user payment:", error);

    // Abort transaction on error
    await session.abortTransaction();

    throw new Error("Error processing user payment");
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

const processProvidusFailedUserPayment = async (
  wallet,
  body,
  referenceId,
  withdrawalResponse,
  withdrawalAmount,
  totalWithdrawalAmount
) => {
  const session = await mongoose.startSession();
  let withdrawalHistory;

  try {
    console.log(
      "Starting failed user payment processing with reference ID:",
      referenceId
    );

    // Start transaction
    session.startTransaction();

    wallet.mainBalance += totalWithdrawalAmount;
    console.log("New wallet balance:", wallet.mainBalance);
    await wallet.save({ session });

    // Create withdrawal history for failed payment
    withdrawalHistory = new WalletHistory({
      user: wallet.user,
      amount: withdrawalAmount,
      currency: "NGN",
      transactionType: "Debit",
      description: `Space Wallet Withdrawal to ${body?.data?.beneficiaryAccountNumber}`,
      merchantReference: referenceId,
      transactionGroup: "transfer",
      status: "Failed",
      message: withdrawalResponse?.data?.responseMessage,
      transactionReference: withdrawalResponse?.data?.transactionReference,
      fees: "20",
      totalAmount: (parseFloat(body?.data?.transactionAmount) + 20).toString(),
      paymentGateway: "providus",
      accountName: body.data.beneficiaryAccountName,
      accountNumber: body.data.beneficiaryAccountNumber,
      bankName: body.data.beneficiaryBank,
      remarks: body.data.narration || ""
    });

    console.log("Failed withdrawal history created:", withdrawalHistory);

    // Save withdrawal history
    await WalletHistory.insertMany([withdrawalHistory], { session });

    console.log("Withdrawal history for failed payment saved successfully");

    // Commit transaction
    await session.commitTransaction();

    return withdrawalHistory;
  } catch (error) {
    console.error("Error processing failed user payment:", error);

    // Abort transaction on error
    await session.abortTransaction();

    throw new Error("Error processing failed user payment");
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

exports.providusWalletWithdrawal = async (req, res) => {
  const { id, userName, email } = req.user;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    console.log("Providus Wallet Withdrawal initiated by user:", id);

    const body = ProvidusWithdrawalSchema.safeParse(req.body);
    if (!body.success) {
      console.log("Invalid request body:", body.error.issues);
      await session.abortTransaction();
      return res.status(400).json({ errors: body.error.issues });
    }

    const wallet = await Wallet.findOne({ user: id }).session(session);
    if (!wallet) {
      console.log("Wallet not found for user:", id);
      await session.abortTransaction();
      return res.status(400).json({ error: "Wallet not found" });
    }

    // Check if it's the withdrawal date or after
    const currentDate = new Date();
    console.log("Current date:", currentDate);
    if (
      wallet.nextWithdrawalDate &&
      currentDate < new Date(wallet.nextWithdrawalDate)
    ) {
      console.log("Cannot withdraw before the next withdrawal date");
      await session.abortTransaction();
      return res
        .status(400)
        .json({ error: "Cannot withdraw before the next withdrawal date" });
    }

    const { pin } = body.data;
    if (!(await compare(pin, wallet.pin))) {
      console.log("Incorrect PIN for user:", id);
      await session.abortTransaction();
      return res.status(400).json({ error: "Incorrect PIN" });
    }

    const referenceId = await getReferenceId(wallet);
    console.log("Generated reference ID:", referenceId);

    // const withdrawalAmount = parseFloat(body.data.transactionAmount);
    const withdrawalAmount = parseFloat(body?.data?.transactionAmount.replace(/,/g, ''));
    const totalWithdrawalAmount = withdrawalAmount + 20;
    console.log(
      "Withdrawal amount:",
      withdrawalAmount,
      "Total amount with fees:",
      totalWithdrawalAmount
    );

    if (totalWithdrawalAmount > wallet.mainBalance) {
      console.log(
        "Insufficient balance for user:",
        id,
        "Main balance:",
        wallet.mainBalance,
        "Total withdrawal amount:",
        totalWithdrawalAmount
      );
      await session.abortTransaction();
      return res.status(400).json({ error: "Insufficient Balance" });
    }

    const withdrawalData = await prepareProvidusWithdrawalData(
      body.data,
      withdrawalAmount,
      referenceId
    );
    console.log("Prepared withdrawal data:", withdrawalData);

    wallet.mainBalance -= totalWithdrawalAmount;
    console.log("New wallet balance:", wallet.mainBalance);
    await wallet.save({ session });

    // Commit the transaction before moving to the next step
    await session.commitTransaction();
    session.endSession();

    const withdrawalResponse = await makeProvidusWithdrawalRequest(
      withdrawalData
    );
    console.log("Providus withdrawal response:", withdrawalResponse.data);

    if (withdrawalResponse.data.responseCode === "00") {
      // Withdrawal successful
      console.log("Withdrawal successful for user:", id);
      await processProvidusSuccessfulUserPayment(
        wallet,
        body,
        referenceId,
        withdrawalResponse,
        withdrawalAmount
      );

      const description = `Space Wallet Withdrawal to ${body?.data?.beneficiaryAccountName} | ${body?.data?.beneficiaryAccountNumber}`;
      const newDate = new Date();
      const localDate = newDate.toLocaleString("en-GB", {
        timeZone: "Africa/Lagos",
      });
      console.log(localDate);

      // Generate the HTML content for the email
      const emailContent = transfer(
        userName,
        withdrawalAmount,
        wallet.mainBalance.toFixed(2),
        description,
        localDate
      );

      console.log("Email content:", emailContent);

      // Set up the email data
      const emailData = {
        to: email,
        subject: "Transfer Successful",
        html: emailContent,
      };

      // Send the email
      await sendEmail(emailData);

      console.log("Email sent successfully");

      const eventData = {
        transactionReference: withdrawalResponse?.data?.transactionReference,
        transferType: "external",
      };
      // Add to queue event
      console.log("Adding transaction to queue:", eventData);
      await addTrxToQueue(eventData);
      return res.status(200).json({
        message: "Wallet Liquidated Successfully",
        withdrawal: withdrawalResponse.data,
      });
    } else {
      // Withdrawal failed
      // Check other response codes
      if (withdrawalResponse.data.responseCode === "32") {
        await processProvidusFailedUserPayment(
          wallet,
          body,
          referenceId,
          withdrawalResponse,
          withdrawalAmount,
          totalWithdrawalAmount
        );
        return res.status(400).json({
          message: "Transaction failed",
          withdrawal: withdrawalResponse.data,
        });
      } else if (withdrawalResponse.data.responseCode === "7709") {
        console.error(
          "Transaction reference exists: ",
          withdrawalResponse.data
        );
        return res.status(400).json({
          message: "Duplicate transaction",
          withdrawal: withdrawalResponse.data,
        });
      } else {
        // For other error cases, return a generic response
        return res.status(400).json({
          message: "Wallet Liquidation error.",
          withdrawal: withdrawalResponse.data,
        });
      }
    }
  } catch (error) {
    console.error("Error in providusWalletWithdrawal:", error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return res.status(500).json({ errors: [{ error: "Server Error" }] });
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

async function prepareProvidusWithdrawalData(
  payload,
  withdrawalAmount,
  referenceId
) {
  return {
    beneficiaryAccountName: payload.beneficiaryAccountName,
    transactionAmount: withdrawalAmount,
    currencyCode: payload.currencyCode,
    narration: payload.narration || "",
    sourceAccountName: payload.sourceAccountName,
    beneficiaryAccountNumber: payload.beneficiaryAccountNumber,
    beneficiaryBank: payload.beneficiaryBank,
    transactionReference: referenceId,
    userName: process.env.PROVIDUS_AUTH_USERNAME,
    password: process.env.PROVIDUS_AUTH_PASSWORD,
  };
}

async function makeProvidusWithdrawalRequest(withdrawalData, session) {
  return axios.post(PROVIDUS_API_URL, withdrawalData, {
    headers: PROVIDUS_API_HEADERS,
  });
}
// const PROVIDUS_API_URL =
//   "http://154.113.16.142:8882/postingrest/NIPFundTransfer";

const PROVIDUS_API_URL = process.env.PROVIDUS_NIP_API_URL;

const PROVIDUS_API_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const processProvidusInternalTransferSuccessfulUserPayment = async (
  wallet,
  body,
  referenceId,
  withdrawalResponse
) => {
  const session = await mongoose.startSession();
  let withdrawalHistory;

  try {
    console.log(
      "Starting user payment processing with reference ID:",
      referenceId
    );

    await session.withTransaction(async () => {
      // Update wallet balance
      const totalWithdrawalAmount =
        parseFloat(body?.data?.transactionAmount) + 20;
      console.log("Total withdrawal amount with fees:", totalWithdrawalAmount);

      console.log("wallet Balance:", wallet.mainBalance);

      wallet.mainBalance -= totalWithdrawalAmount;
      console.log("New wallet balance:", wallet.mainBalance);

      // Update lastWithdrawalDate and nextWithdrawalDate after successful withdrawal
      const currentDate = new Date();
      console.log("Updating wallet last withdrawal date to: ", currentDate);
      wallet.lastWithdrawalDate = currentDate;
      const thirtyDaysLater = new Date(currentDate);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      console.log("Updating wallet next withdrawal date to: ", thirtyDaysLater);
      wallet.nextWithdrawalDate = thirtyDaysLater;

      // Create withdrawal history and modify it
      withdrawalHistory = new WalletHistory({
        user: wallet.user,
        amount: body.data.transactionAmount,
        currency: "NGN",
        transactionType: "Debit",
        description: `Space Wallet Withdrawal to ${body?.data?.beneficiaryAccountNumber} | Internal Transfer`,
        merchantReference: referenceId,
        transactionGroup: "transfer",
        status:
          withdrawalResponse?.data?.responseCode === "00"
            ? "Success"
            : "Failed",
        message: withdrawalResponse?.data?.responseMessage,
        transactionReference: withdrawalResponse?.data?.transactionReference,
        fees: "20",
        totalAmount: totalWithdrawalAmount.toString(),
        paymentGateway: "providus",
        accountName: body.data.creditAccountName,
        accountNumber: body.data.creditAccount,
        bankName: body.data.beneficiaryBank,
        remarks: body.data.narration || ""
      });

      console.log("Withdrawal history created:", withdrawalHistory);

      // Save wallet and withdrawal history
      await Promise.all([
        WalletHistory.insertMany([withdrawalHistory], { session }),
        wallet.save({ session }),
      ]);

      console.log("Wallet and withdrawal history saved successfully");
    });

    return withdrawalHistory;
  } catch (error) {
    console.error("Error processing user payment:", error);
    throw new Error("Error processing user payment");
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

const processProvidusInternalTransferFailedUserPayment = async (
  wallet,
  body,
  referenceId,
  withdrawalResponse
) => {
  const session = await mongoose.startSession();
  let withdrawalHistory;

  try {
    console.log(
      "Starting failed user payment processing with reference ID:",
      referenceId
    );

    await session.withTransaction(async () => {
      // Create withdrawal history for failed payment
      withdrawalHistory = new WalletHistory({
        user: wallet.user,
        amount: body.data.transactionAmount,
        currency: "NGN",
        transactionType: "Debit",
        description: `Space Wallet Withdrawal to ${body?.data?.beneficiaryAccountNumber} | Internal Transfer`,
        merchantReference: referenceId,
        transactionGroup: "transfer",
        status: "Failed",
        message: withdrawalResponse?.data?.responseMessage,
        transactionReference: withdrawalResponse?.data?.transactionReference,
        fees: "20",
        totalAmount: (
          parseFloat(body?.data?.transactionAmount) + 20
        ).toString(),
        paymentGateway: "providus",
        accountName: body.data.creditAccountName,
        accountNumber: body.data.creditAccount,
        bankName: body.data.beneficiaryBank,
        remarks: body.data.narration || ""
      });

      console.log("Failed withdrawal history created:", withdrawalHistory);

      // Save withdrawal history
      await WalletHistory.insertMany([withdrawalHistory], { session });

      console.log("Withdrawal history for failed payment saved successfully");
    });

    return withdrawalHistory;
  } catch (error) {
    console.error("Error processing failed user payment:", error);
    throw new Error("Error processing failed user payment");
  } finally {
    console.log("Ending transaction session");
    session.endSession();
  }
};

// Function to initiate Providus to Providus transfer
exports.providusToProvidusTransfer = async (req, res) => {
  const { id } = req.user;

  try {
    console.log("Providus to Providus Transfer initiated by user:", id);

    const body = ProvidusTransferSchema.safeParse(req.body);
    if (!body.success) {
      console.log("Invalid request body:", body.error.issues);
      return res.status(400).json({ errors: body.error.issues });
    }

    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) {
      console.log("Wallet not found for user:", id);
      return res.status(400).json({ error: "Wallet not found" });
    }

    // Check if it's the withdrawal date or after
    const currentDate = new Date();
    if (
      wallet.nextWithdrawalDate &&
      currentDate < new Date(wallet.nextWithdrawalDate)
    ) {
      console.log("Cannot withdraw before the next withdrawal date");
      return res
        .status(400)
        .json({ error: "Cannot withdraw before the next withdrawal date" });
    }

    const { pin } = body.data;
    if (!(await compare(pin, wallet.pin))) {
      console.log("Incorrect PIN for user:", id);
      return res.status(400).json({ error: "Incorrect PIN" });
    }

    const referenceId = await getReferenceId(wallet);
    console.log("Generated reference ID:", referenceId);

    const withdrawalAmount = parseFloat(body.data.transactionAmount);
    const totalWithdrawalAmount = withdrawalAmount + 20;
    console.log(
      "Withdrawal amount:",
      withdrawalAmount,
      "Total amount with fees:",
      totalWithdrawalAmount
    );

    if (totalWithdrawalAmount > wallet.mainBalance) {
      console.log(
        "Insufficient balance for user:",
        id,
        "Main balance:",
        wallet.mainBalance,
        "Total withdrawal amount:",
        totalWithdrawalAmount
      );
      return res.status(400).json({ error: "Insufficient Balance" });
    }

    const transferData = await prepareProvidusTransferData(
      body.data,
      referenceId
    );
    console.log("Prepared transfer data:", transferData);

    const transferResponse = await makeProvidusTransferRequest(transferData);
    console.log("Providus transfer response:", transferResponse.data);

    if (transferResponse.data.responseCode === "00") {
      // Transfer successful
      console.log("Transfer successful for user:", id);
      await processProvidusInternalTransferSuccessfulUserPayment(
        wallet,
        body,
        referenceId,
        transferResponse
      );
      const eventData = {
        transactionReference: transferResponse.data.transactionReference,
        transferType: "internal",
      };

      // Add to queue event
      await addTrxToQueue(eventData);
      console.log("Transaction added to queue:", eventData);

      return res.status(200).json({
        message: "Transfer successful",
        transfer: transferResponse.data,
      });
    } else {
      // Transfer failed
      if (transferResponse.data.responseCode === "32") {
        console.log("Transfer failed with response code 32 for user:", id);
        await processProvidusInternalTransferFailedUserPayment(
          wallet,
          body,
          referenceId,
          transferResponse
        );
        return res.status(400).json({
          message: "Transaction failed",
          transfer: transferResponse.data,
        });
      } else if (transferResponse.data.responseCode === "7709") {
        console.error("Transaction reference exists:", transferResponse.data);
        return res.status(400).json({
          message: "Duplicate transaction",
          transfer: transferResponse.data,
        });
      } else {
        // For other error cases, return a generic response
        console.log(
          "Transfer failed with response code:",
          transferResponse.data.responseCode
        );
        return res.status(400).json({
          message: "Wallet Liquidation error.",
          transfer: transferResponse.data,
        });
      }
    }
  } catch (error) {
    console.error("Error in providusToProvidusTransfer:", error);
    return res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// Function to prepare data for Providus transfer
async function prepareProvidusTransferData(payload, referenceId) {
  return {
    creditAccount: payload.creditAccount,
    debitAccount: payload.debitAccount,
    transactionAmount: payload.transactionAmount,
    currencyCode: payload.currencyCode,
    narration: payload.narration || "",
    transactionReference: referenceId,
    userName: process.env.PROVIDUS_AUTH_USERNAME,
    password: process.env.PROVIDUS_AUTH_PASSWORD,
  };
}

// Function to make Providus transfer request
async function makeProvidusTransferRequest(transferData, session) {
  return axios.post(PROVIDUS_TRANSFER_API_URL, transferData, {
    headers: PROVIDUS_API_HEADERS,
  });
}

// Constant for Providus transfer API URL
// const PROVIDUS_TRANSFER_API_URL =
//   "http://154.113.16.142:8882/postingrest/ProvidusFundTransfer";

const PROVIDUS_TRANSFER_API_URL = process.env.PROVIDUS_TRANSFER_API_URL;

exports.getProvidusTransactionStatus = async (req, res) => {
  const url = "http://154.113.16.142:8882/postingrest/GetNIPTransactionStatus";
  const { transactionReference } = req.body;

  if (!transactionReference) {
    return res.status(400).json({ error: "Transaction reference is required" });
  }

  const requestData = {
    transactionReference,
    userName: process.env.PROVIDUS_AUTH_USERNAME,
    password: process.env.PROVIDUS_AUTH_PASSWORD,
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "Failed to get transaction status: " + error.message });
  }
};

exports.setUserDefaultBank = async (req, res) => {
  const userId = req.user.id;
  const { bankName } = req.body;

  try {
    let accountName = "";
    let accountNumber = "";
    let defaultBank = "";

    // Check if bankName is valid
    if (!["watu", "providus"].includes(bankName.toLowerCase())) {
      throw new Error("Invalid bank name");
    }

    // Fetch user bank details based on bankName
    if (bankName.toLowerCase() === "watu") {
      const watuBank = await DVA.findOne({ user: userId }).lean();
      if (watuBank) {
        accountName = watuBank.dvaName;
        accountNumber = watuBank.dvaNumber;
        defaultBank = "watu";
      }
    } else if (bankName.toLowerCase() === "providus") {
      const providusBank = await Providus.findOne({ user: userId }).lean();
      if (providusBank) {
        accountName = providusBank.accountName;
        accountNumber = providusBank.accountNumber;
        defaultBank = "providus";
      }
    }

    // Update the user's default bank
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          has_dva: true,
          dva_name: accountName,
          dva_number: accountNumber,
          defaultBank: defaultBank,
        },
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to set default bank" });
  }
};

/*

curl -X POST http://154.113.16.142:8088/postingrest/NIPFundTransfer \
  -H "Content-Type: application/json" \
  -d '{
    "beneficiaryAccountName": "UGBO, CHARLES UMORE",
    "transactionAmount": "2000.45",
    "currencyCode": "NGN",
    "narration": "Testing",
    "sourceAccountName": "Nnamdi Adebayo Hamzat",
    "beneficiaryAccountNumber": "0045434120",
    "beneficiaryBank": "000013",
    "transactionReference": "20191119143854",
    "userName": "test",
    "password": "test"
  }'

curl --location 'http://154.113.16.142:8088/postingrest/NIPFundTransfer' \
--header 'Content-Type: application/json' \
--header 'X-Auth-Signature: BE09BEE831CF262226B426E39BD1092AF84DC63076D4174FAC78A2261F9A3D6E59744983B8326B69CDF2963FE314DFC89635CFA37A40596508DD6EAAB09402C7' \
--header 'Client-Id: dGVzdF9Qcm92aWR1cw==' \
--data '{
  "beneficiaryAccountName": "CHUKWUEBUKA VICTOR OKOYE",
  "transactionAmount": "100",
  "currencyCode": "NGN",
  "narration": "Testing",
  "sourceAccountName": "MERCHANT(victor)",
  "beneficiaryAccountNumber": "7088949042",
  "beneficiaryBank": "100004",
  "transactionReference": "TRF2024040813245610",
  "userName": "test",
  "password": "test"
}'

*/

exports.getWalletHistory = async (req, res) => {
  console.log("checking");
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

    const walletHistories = await WalletHistory.find({
      user: id,
      status: { $nin: ["pending", "Pending"] },
    })
      .sort({ createdAt: -1 })
      .exec();

    console.log(walletHistories);
    if (!walletHistories || walletHistories.length === 0) {
      return res.status(404).json({
        errors: [
          {
            error: "Wallet Histories not found",
          },
        ],
      });
    }

    return res.status(200).json({
      msg: "User Wallet Histories Successfully Fetched",
      walletHistories,
    });
  } catch (error) {
    console.log("ERROR GETTING USER WALLET HISTORIES=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getAllWithdrawals = async (req, res) => {
  try {
    const wallets = await WalletHistory.find({
      transactionGroup: "transfer",
    })
      .sort({ createdAt: -1 })
      .populate("user", "-password");
    res.status(200).json({
      wallets,
    });
  } catch (error) {
    console.log("GET ALL WALLETS ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
exports.getAllDvaPayments = async (req, res) => {
  try {
    const fundHistories = await WalletHistory.find({
      transactionGroup: "static-account-transfer",
    })
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .populate("user", "-password");
    res.status(200).json({
      fundHistories,
    });
  } catch (error) {
    console.log("GET ALL Virtual Accounts Funding ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getAllWalletHistories = async (req, res) => {
  try {
    let query = {};

    //optional;
    if (req.query.transactionType) {
      query.transactionType = req.query.transactionType;
    }

    // Optional date range filter
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    //optional
    if (req.query.transactionGroup) {
      query.transactionGroup = req.query.transactionGroup;
    }

    //optional
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Optional search query
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    //optional
    if (req.query.minAmount && req.query.maxAmount) {
      query.amount = {
        $gte: req.query.minAmount,
        $lte: req.query.maxAmount,
      };
    } else if (req.query.minAmount) {
      query.amount = { $gte: req.query.minAmount };
    } else if (req.query.maxAmount) {
      query.amount = { $lte: req.query.maxAmount };
    }

    const walletHistories = await WalletHistory.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "firstName lastName email avatar.url",
      })
      .where(query);

    const result = await WalletHistory.aggregate([
      {
        $group: {
          _id: null,
          totalInflow: {
            $sum: {
              $round: [
                {
                  $cond: {
                    if: { $eq: ["$transactionType", "Credit"] },
                    then: "$amount",
                    else: 0,
                  },
                },
                2,
              ],
            },
          },
          totalOutflow: {
            $sum: {
              $round: [
                {
                  $cond: {
                    if: { $eq: ["$transactionType", "Debit"] },
                    then: "$amount",
                    else: 0,
                  },
                },
                2,
              ],
            },
          },
          totalTransactions: { $sum: 1 },
          totalCreditTransactions: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Credit"] }, 1, 0] },
          },
          totalDebitTransactions: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Debit"] }, 1, 0] },
          },
        },
      },
    ]);

    const {
      totalInflow,
      totalOutflow,
      totalTransactions,
      totalCreditTransactions,
      totalDebitTransactions,
    } = result[0] || {
      totalInflow: 0,
      totalOutflow: 0,
      totalTransactions: 0,
      totalCreditTransactions: 0,
      totalDebitTransactions: 0,
    };

    res.status(200).json({
      msg: "Wallet Histories Successfully Fetched",
      walletHistories,
      totalInflow,
      totalOutflow,
      totalTransactions,
      totalCreditTransactions,
      totalDebitTransactions,
    });
  } catch (error) {
    console.log("GET ALL Transactions ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.getUserWalletHistory = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId)
      .select("firstName lastName email avatar.url")
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);

    const userWallet = await Wallet.findOne({ user: userIdObj })
      .select("_id mainBalance")
      .lean()
      .exec();

    const walletHistories = await WalletHistory.find({ user: userIdObj })
      .sort({ createdAt: -1 })
      .exec();

    const result = await WalletHistory.aggregate([
      {
        $match: { user: userIdObj },
      },
      {
        $group: {
          _id: null,
          totalInflow: {
            $sum: {
              $round: [
                {
                  $cond: {
                    if: { $eq: ["$transactionType", "Credit"] },
                    then: {
                      $add: [{ $toDouble: "$amount" }, { $toDouble: "$fees" }],
                    },
                    else: 0,
                  },
                },
                2,
              ],
            },
          },
          totalOutflow: {
            $sum: {
              $round: [
                {
                  $cond: {
                    if: { $eq: ["$transactionType", "Debit"] },
                    then: {
                      $add: [{ $toDouble: "$amount" }, { $toDouble: "$fees" }],
                    },
                    else: 0,
                  },
                },
                2,
              ],
            },
          },
          totalTransactions: { $sum: 1 },
          totalCreditTransactions: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Credit"] }, 1, 0] },
          },
          totalDebitTransactions: {
            $sum: { $cond: [{ $eq: ["$transactionType", "Debit"] }, 1, 0] },
          },
        },
      },
    ]);

    const {
      totalInflow,
      totalOutflow,
      totalTransactions,
      totalCreditTransactions,
      totalDebitTransactions,
    } = result[0] || {
      totalInflow: 0,
      totalOutflow: 0,
      totalTransactions: 0,
      totalCreditTransactions: 0,
      totalDebitTransactions: 0,
    };

    res.status(200).json({
      msg: "Wallet Histories Successfully Fetched",
      user: { ...user, wallet: userWallet },
      walletHistories,
      totalInflow,
      totalOutflow,
      totalTransactions,
      totalCreditTransactions,
      totalDebitTransactions,
    });
  } catch (error) {
    console.log("GET User Wallet History ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.userRecentTransfers = async (req, res) => {
  try {
    const userId = req.user.id;

    const recentTransfers = await UserBeneficiary.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (recentTransfers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recent transfers found for the user",
      });
    }

    res.status(200).json({ success: true, recentTransfers });
  } catch (error) {
    console.error("Error fetching recent transfers:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
