const axios = require("axios");
const Activities = require("../models/Activities");
const BVN = require("../models/BVN");
const User = require("../models/User");
const WalletHistory = require("../models/WalletHistory");
const Wallet = require("../models/Wallet");
const Providus = require("../models/ProvidusAcc");
const { ProvidusAccountSchema } = require("../validations/providus");
const { generateRandomAlphanumeric } = require("../helpers/airtimeRecharge");
const { AppError } = require("../helpers/error");

const virtualAccountBaseURL =
  "https://vps.providusbank.com/vps/api/PipCreateReservedAccountNumber";

// const virtualAccountBaseURL =
//   "http://154.113.16.142:8088/appdevapi/api/PiPCreateReservedAccountNumber";


  // Function to get Providus account details from Providus API
const getProvidusAccount = async (request) => {
  const url = "http://154.113.166.30:5120/postingrest/GetProvidusAccount";

  try {
    const response = await axios.post(url, request, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to get Providus account: " + error.message);
  }
};

// Controller function to get Providus account details
exports.getProvidusAccountDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const providusAccount = await Providus.findOne({ user: userId });

    if (!providusAccount) {
      return res.status(404).json({ error: "Providus account not found" });
    }

    const requestData = {
      accountNumber: providusAccount.accountNumber,
      userName: process.env.PROVIDUS_AUTH_USERNAME,
      password: process.env.PROVIDUS_AUTH_PASSWORD
    };

    const accountDetails = await getProvidusAccount(
      JSON.stringify(requestData)
    );

    res.status(200).json(accountDetails);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch Providus account details" });
  }
};

const getNIPAccount = async (requestData) => {
  const url = "http://154.113.166.30:5120/postingrest/GetNIPAccount";

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error("Failed to get NIP account: " + error.message);
  }
};

exports.getNIPAccountDetails = async (req, res) => {
  try {
    const { accountNumber, beneficiaryBank } = req.body;

    if (!accountNumber || !beneficiaryBank) {
      return res.status(400).json({ error: "Missing accountNumber or beneficiaryBank in request body" });
    }

    const requestData = {
      accountNumber,
      beneficiaryBank,
      userName: process.env.PROVIDUS_AUTH_USERNAME,
      password: process.env.PROVIDUS_AUTH_PASSWORD
    };

    const accountDetails = await getNIPAccount(requestData);

    if (accountDetails.responseCode === "00") {
      res.status(200).json(accountDetails);
    } else if (accountDetails.responseCode === "07") {
      res.status(400).json({ error: "Invalid Account" });
    } else {
      res.status(500).json({ error: "Unexpected response from NIP service" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch NIP account details" });
  }
};


exports.createProvidusVirtualAccount = async (req, res) => {
  const body = ProvidusAccountSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const user = await User.findOne({ email: body.data.email })
      .select("_id firstName lastName bvn phoneNumber email")
      .lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const [existingProvidusAccount, bvnInfo] = await Promise.all([
      Providus.findOne({ user: user._id }),
      BVN.findOne({ user: user._id }),
    ]);

    if (existingProvidusAccount) {
      return res
        .status(400)
        .json({ error: "User already has a Providus account" });
    }

    if (!bvnInfo) {
      return res.status(404).json({ error: "User BVN not found" });
    }

    const data = {
      account_name: `${bvnInfo.firstName} ${bvnInfo.lastName}`,
      bvn: bvnInfo.bvn,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: virtualAccountBaseURL,

      headers: {
        "Content-Type": "application/json",
        "X-Auth-Signature": process.env.PROVIDUS_X_AUTH_SIGNATURE,
        "Client-Id": process.env.PROVIDUS_CLIENTID,
      },
      data,
    };

    const providusResponse = await axios(config);
    console.log("Providus Virtual Account Response =>", providusResponse.data);

    if (providusResponse.data.requestSuccessful) {
      const providusData = {
        user: user._id,
        accountName: providusResponse.data.account_name,
        customer_email: user.email,
        customer_id: user.bvn,
        institution_reference: "rentspace",
        customer_phone: user.phoneNumber,
        accountNumber: providusResponse.data.account_number,
      };

      const [newProvidus] = await Promise.all([
        Providus.create(providusData),
        User.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              has_dva: true,
              dva_name: providusResponse.data.account_name,
              dva_number: providusResponse.data.account_number,
              defaultBank: "providus",
            },
          },
          { new: true }
        ),
        Activities.create({
          user: user._id,
          activityType: "Providus Reserved Account Creation",
          description: "Virtual Account Created",
        }),
      ]);

      return res.status(200).json({
        message: "Virtual Account created successfully",
        data: newProvidus,
      });
    } else {
      return res
        .status(400)
        .json({ error: providusResponse.data.responseMessage });
    }
  } catch (error) {
    console.error("Providus Virtual Account Creation Error =>", error);
    return res.status(500).json({ error: "Server Error" });
  }
};

exports.createUserProvidusAccountOnLogin = async (email) => {
  try {
    const user = await User.findOne({ email })
      .select("_id firstName lastName bvn phoneNumber email")
      .lean();
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const [existingProvidusAccount, bvnInfo] = await Promise.all([
      Providus.findOne({ user: user._id }),
      BVN.findOne({ user: user._id }),
    ]);

    if (existingProvidusAccount) {
      console.log("User already has a Providus account");
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            has_dva: true,
            defaultBank: "providus",
          },
        },
        { new: true }
      );
      return { message: "User already has a Providus account" };
    }

    if (!bvnInfo) {
      throw new AppError(404, "User BVN not found");
    }

    const data = {
      account_name: `${bvnInfo.firstName} ${bvnInfo.lastName}`,
      bvn: bvnInfo.bvn,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: virtualAccountBaseURL,
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Signature": process.env.PROVIDUS_X_AUTH_SIGNATURE,
        "Client-Id": process.env.PROVIDUS_CLIENTID,
      },
      data,
    };

    const providusResponse = await axios(config);
    console.log("Providus Virtual Account Response =>", providusResponse.data);

    if (!providusResponse.data.requestSuccessful) {
      throw new AppError(400, providusResponse.data.responseMessage);
    }

    const [newProvidus] = await Promise.all([
      Providus.create({
        user: user._id,
        accountName: providusResponse.data.account_name,
        customer_email: user.email,
        customer_id: user.bvn,
        institution_reference: "rentspace",
        customer_phone: user.phoneNumber,
        accountNumber: providusResponse.data.account_number,
      }),
      User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            has_dva: true,
            dva_name: providusResponse.data.account_name,
            dva_number: providusResponse.data.account_number,
            defaultBank: "providus",
          },
        },
        { new: true }
      ),
      Activities.create({
        user: user._id,
        activityType: "Providus Reserved Account Creation",
        description: "Virtual Account Created",
      }),
    ]);

    return newProvidus;
  } catch (error) {
    console.error("Providus Virtual Account Creation Error =>", error);
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError(500, "Server Error");
    }
  }
};

async function getReferenceId(wallet) {
  return "REF" + generateRandomAlphanumeric(4) + wallet.walletId;
}
//providus to external bank
exports.ProvidusTransactionStatus = async (trxRef, transferType) => {
  let url = "";

  if (transferType === "external") {
    url = "http://154.113.166.30:5120/postingrest/GetNIPTransactionStatus";
    console.log(
      "External transfer detected, URL set to GetNIPTransactionStatus"
    );
  } else {
    // then it is providus to providus transfer you are querying for
    url = "http://154.113.166.30:5120/postingrest/GetProvidusTransactionStatus";
    console.log(
      "Providus to Providus transfer detected, URL set to GetProvidusTransactionStatus"
    );
  }


  if (!trxRef) {
    console.error("Transaction reference is required");
    throw new Error("Transaction reference is required");
  }

  const requestData = {
    transactionReference: trxRef,
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

    console.log("Providus transaction status response received");

    if (!response || typeof response.data === "undefined") {
      console.error("Failed to get transaction status: No response received");
      throw new Error("Failed to get transaction status: No response received");
    }

    const transactionStatus = response.data.responseCode;
    console.log(`Transaction Status: ${transactionStatus}`);

    if (transactionStatus !== "32") {
      console.log(
        `Transaction was Successful On Requery For Final Status: ${response.data.transactionReference}, skipping further processing`
      );
      return;
    }

    console.log(`Transaction Status is 32, proceeding with further processing`);

    const walletHistory = await WalletHistory.findOne({
      merchantReference: trxRef,
    });

    if (!walletHistory) {
      console.error(
        `Wallet history not found for transaction reference: ${trxRef}`
      );
      throw new Error(
        `Wallet history not found for transaction reference: ${trxRef}`
      );
    }

    console.log("Wallet history found:", walletHistory);

    let wallet;
    if (walletHistory.user) {
      wallet = await Wallet.findOne({ user: walletHistory.user });
      console.log("Wallet found for user:", walletHistory.user);
    }

    // Generate reference ID for refund
    const refID = await getReferenceId(wallet || {});
    console.log("Generated reference ID for refund:", refID);

    const refundWalletHistory = new WalletHistory({
      user: walletHistory.user,
      transactionType: "Credit",
      amount: walletHistory.amount,
      currency: walletHistory.currency,
      merchantReference: refID,
      transactionGroup: "refund",
      description: "Refund transaction",
      status: "Success",
      fees: walletHistory.fees,
      paymentGateway: walletHistory.paymentGateway,
      message: response.data.responseMessage,
      totalAmount: (
        parseFloat(walletHistory.amount) + parseFloat(walletHistory.fees)
      ).toString(),
      transactionReference: refID,
    });

    console.log("Refund wallet history created:", refundWalletHistory);

    await refundWalletHistory.save();
    console.log("Refund wallet history saved successfully");

    if (transactionStatus !== "00" && wallet) {
      const refundAmount =
        parseFloat(walletHistory.amount) + parseFloat(walletHistory.fees);
      wallet.mainBalance += refundAmount;
      await wallet.save();
      console.log("Wallet balance updated with refund amount:", refundAmount);
    }

    console.log("Transaction Status Response:", response.data);
  } catch (error) {
    console.error("Error in ProvidusTransactionStatus:", error.message);
    throw new Error(`Failed to get transaction status: ${error.message}`);
  }
};

//providus to providus bank transfer requery

// also check for this status
// {
//    "transactionReference": "TRFTmso4737906174",
//    "sessionId": "Unknown Sess",
//    "responseMessage": "No action taken",
//    "responseCode": "21"
// }

// curl -X POST \
// http://154.113.16.142:8088/appdevapi/api/PiPCreateReservedAccountNumber \
//   -H 'Content-Type: application/json' \
//   -H 'X-Auth-Signature: BE09BEE831CF262226B426E39BD1092AF84DC63076D4174FAC78A2261F9A3D6E59744983B8326B69CDF2963FE314DFC89635CFA37A40596508DD6EAAB09402C7' \
//   -H 'Client-Id:dGVzdF9Qcm92aWR1cw==' \
//   -d '{
//     "account_name": "John Doe",
//     "bvn": "12345678901"
//   }'
