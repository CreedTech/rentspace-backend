const axios = require('axios');
const User = require('../models/User');
const ElectricityBillPayment = require('../models/ElectricityBillPayment');
const {
  ElectricityBillPaymentSchema,
  ElectricityVerificationSchema,
} = require('../validations/electricity');
const { generateRequestId } = require('helpers/airtimeRecharge');
const Wallet = require('../models/Wallet');
const UtilityHistory = require('../models/UtilityHistory');
const WalletHistory = require('../models/WalletHistory');
const { calculateSpacePoint } = require('../helpers/spacePoint');
const Activities = require('../models/Activities');

// TO VERIFY THE CUSTOMER'S METER NUMBER
exports.verifyMeterNumber = async (req, res) => {
  try {
    const body = ElectricityVerificationSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }

    const watuApiResponse = await axios.post(
      process.env.WATU_UTILITY_VALIDATE_URL,
      {
        channel: body.data.billingServiceID,
        meter_number: body.data.meterNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );

    console.log(
      'Watu Electricity Validation API Response=>',
      watuApiResponse.data
    );

    if (watuApiResponse.data.has_error == false) {
      const { name, address, minimum_amount } = watuApiResponse.data.data;

      return res.status(200).json({
        message: 'Meter verification successful',
        customerName: name,
        // meterNumber: Meter_Number,
        minimum_amount: minimum_amount,
        address: address,
      });
    } else if (watuApiResponse.data.status_code == 422) {
      return res.status(400).json({
        errors: [
          {
            error: 'Meter verification failed',
            error,
          },
        ],
      });
    } else {
      return res
        .status(500)
        .json({ message: 'Unexpected response from Watu API' });
    }
  } catch (error) {
    console.error('Meter Verification Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//TO RECHARGE ELECTRICITY BILLS
exports.electricityRecharge = async (req, res) => {
  const { id } = req.user;
  let user;
  user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: 'User not found',
        },
      ],
    });
  }

  const wallet = await Wallet.findOne({ user: user._id });
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

  const body = ElectricityBillPaymentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  if (parseFloat(body.data.amount) > wallet.mainBalance) {
    return res.status(400).json({ error: 'Insufficient Balance' });
  }

  try {
    const electricityOrder = await ElectricityBillPayment.create({
      user: id,
      ...body.data,
      // requestId: generateRequestId(),
    });

    // const requestId = generateRequestId();

    const watuApiResponse = await axios.post(
      process.env.WATU_UTILITY_URL,
      {
        channel: body.data.billingServiceID,
        contact_type: 'phone',
        amount: body.data.amount,
        phone_number: body.data.phoneNumber,
        email: body.data.email,
        request_time: Date.now(),
        business_signature: process.env.BUSINESS_SIGNATURE,
        meter_number: body.data.meterNumber,
        ignore_duplicate: 1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );

    console.log('WATU_API_RESPONSE=>', watuApiResponse);

    // Update the order status and transaction details in the database
    wallet.mainBalance -= parseFloat(body.data.amount);
    await wallet.save();
    if (watuApiResponse.data.has_error == false) {
      electricityOrder = await ElectricityBillPayment.findOneAndUpdate(
        { user: id },
        {
          $set: {
            status: watuApiResponse.data.data.status,
            transactionId: watuApiResponse.data.data.transaction_reference,
            requestId: watuApiResponse.data.data.merchant_reference,
          },
        },
        { new: true }
      );
      const { spacePoints, earnedAmountNaira } = calculateSpacePoint(
        body.data.amount
      );
      if (body.data.amount >= 400) {
        user.utility_points += spacePoints;
        wallet.availableBalance += earnedAmountNaira;
      }
      await wallet.save();
      await user.save();
      // await electricityOrder.save();
      // calculateSpacePoints(body.data.amount);
      const walletHistory = new WalletHistory({
        user: wallet.user, // Assuming 'user' field is populated in Wallet model
        amount: body.data.amount,
        currency: 'NGN',
        transactionType: 'Debit',
        fees: 0,
        totalAmount: body.data.amount,
        merchantReference: watuApiResponse.data.data.merchant_reference,
        transactionReference: watuApiResponse.data.data.transaction_reference,
        status: watuApiResponse.data.data.status,
        message: watuApiResponse.data.data.message,
        description: watuApiResponse.data.data.description,
        transactionGroup: 'bill',

        // Add other fields as needed
      });
      const utilityHistory = new UtilityHistory({
        user: wallet.user, // Assuming 'user' field is populated in Space model
        transactionReference: watuApiResponse.data.data.transaction_reference,
        amount: watuApiResponse.data.data.payment_data.amount,
        currency: 'NGN',
        fees: 0,
        biller: body.data.network,
        totalAmount: watuApiResponse.data.data.payment_data.amount,
        merchantReference: watuApiResponse.data.data.merchant_reference,
        status: watuApiResponse.data.data.status,
        message: watuApiResponse.data.data.message,
        description: watuApiResponse.data.data.description,
        transactionType: 'bill',
        // Add other fields as needed
      });

      // Save the WalletHistory document
      await walletHistory.save();
      await utilityHistory.save();
    } else if (watuApiResponse.data.status_code == 422) {
      const resultOptions = watuApiResponse.data.data.map((option) => {
        return {
          result: option[0],
        };
      });
      return res.status(400).json({ message: watuApiResponse.data.message });
    } else if (watuApiResponse.data.has_error == true) {
      //     airtimeOrder.transactionId = watuApiResponse.data.data.transaction_reference;
      // airtimeOrder.status = 'failed';
      electricityOrder = await ElectricityBillPayment.findOneAndUpdate(
        { user: id },
        {
          $set: {
            status: 'failed',
            transactionId: watuApiResponse.data.data.transaction_reference,
          },
        },
        { new: true }
      );
      // await electricityOrder.save();
    } else if (watuApiResponse.data.data.status.toLowerCase() == 'failed') {
      wallet.mainBalance -= parseFloat(body.data.amount);
      await wallet.save();
      const walletHistory = new WalletHistory({
        user: wallet.user, // Assuming 'user' field is populated in Wallet model
        amount: body.data.amount,
        currency: 'NGN',
        transactionType: 'Debit',
        fees: 0,
        totalAmount: body.data.amount,
        merchantReference: watuApiResponse.data.data.merchant_reference,
        transactionReference: watuApiResponse.data.data.transaction_reference,
        status: watuApiResponse.data.data.status,
        message: watuApiResponse.data.data.message,
        description: watuApiResponse.data.data.description,
        transactionGroup: 'bill',
        // Add other fields as needed
      });
      await walletHistory.save();
    }

    // await electricityOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (electricityOrder.status === 'completed') {
      const activity = new Activities({
        user: user._id,
        activityType: 'Bill Payment',
        description: 'Bill Payment Successful',
      });
      await activity.save();
      return res.status(200).json({
        message: watuApiResponse.data.data.bill_data.Token,
        electricityOrder: electricityOrder,
      });
    } else {
      return res.status(400).json({ message: watuApiResponse.data });
    }
  } catch (error) {
    console.error('DATA SUBSCRIPTION ERROR=>', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};

// //TO RECHARGE ELECTRICITY BILLS - Postpaid
// exports.electricityPostpaidRecharge = async (req, res) => {
//   const { id } = req.user;
//   const user = await User.find({ user: id });
//   if (!user) {
//     return res.status(404).json({
//       errors: [
//         {
//           error: 'User not found',
//         },
//       ],
//     });
//   }

//   const body = ElectricityBillPaymentSchema.safeParse(req.body);

//   if (!body.success) {
//     return res.status(400).json({ errors: body.error.issues });
//   }

//   try {
//     const electricityOrder = await ElectricityBillPayment.create({
//       user: id,
//       ...body.data,
//       requestId: generateRequestId(),
//     });

//     const requestId = generateRequestId();

//     //To make the call to vtpass endpoints and buy the electricity.
//     const vtPassApiUrl = process.env.VTPASS_API_URL;

//     const vtPassApiKey = process.env.VTPASS_API_KEY;
//     const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
//     const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;

//     const vtPassApiResponse = await axios.post(
//       vtPassApiUrl,
//       {
//         serviceID: body.data.billingServiceID,
//         billersCode: body.data.meterNumber,
//         variation_code: 'postpaid',
//         amount: body.data.amount,
//         phone: body.data.phoneNumber,
//         request_id: requestId,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'api-key': vtPassApiKey,
//           'secret-key': vtPassSecretKey,
//           'public-key': vtPassPublicKey,
//         },
//       }
//     );

//     const transactionId =
//       vtPassApiResponse.data?.content?.transactions?.transactionId;

//     if (
//       vtPassApiResponse.data.response_description == 'TRANSACTION SUCCESSFUL'
//     ) {
//       electricityOrder.status = 'delivered';
//       electricityOrder.transactionId = transactionId;
//     } else if (vtPassApiResponse.data.code == '016') {
//       electricityOrder.transactionId = transactionId;
//       electricityOrder.status = 'failed';
//     }

//     await electricityOrder.save();

//     //TODO
//     // Send a confirmation email to the user

//     if (electricityOrder.status === 'delivered') {
//       return res.status(200).json({ message: vtPassApiResponse.data });
//     } else {
//       return res
//         .status(400)
//         .json({ message: vtPassApiResponse.data.response_description });
//     }
//   } catch (error) {
//     console.error('Recharge Electricity Bill Error=>', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
