const axios = require('axios');
const Data = require('../models/Data');
const User = require('../models/User');
const { DataSchema } = require('../validations/data');
const { generateRequestId } = require('../helpers/airtimeRecharge');
const { calculateSpacePoint } = require('../helpers/spacePoint');
const WalletHistory = require('../models/WalletHistory');
const Wallet = require('../models/Wallet');
const Activities = require('../models/Activities');
const UtilityHistory = require('../models/UtilityHistory');

// TO GET DATA SUBSCRIPTION VARIATION CODES
exports.getDataVariationCodes = async (req, res) => {
  try {
    const { selectedNetwork } = req.body;
    console.log('SELECTED NETWORK=>', selectedNetwork);

    let billId;

    if (selectedNetwork.toLowerCase() === 'mtn') {
      billId = 'bill-18';
    } else if (selectedNetwork.toLowerCase() === 'airtel') {
      billId = 'bill-16';
    } else if (selectedNetwork.toLowerCase() === 'glo') {
      billId = 'bill-07';
    } else if (selectedNetwork.toLowerCase() === '9mobile') {
      billId = 'bill-19';
    } else {
      return res.status(400).json({
        errors: [
          {
            error: 'Invalid network selection',
          },
        ],
      });
    }

    const watuApiResponse = await axios.post(
      'https://api.watupay.com/v1/watubill/bill-types',
      {
        channel: billId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
        },
      }
    );
    console.log('Watu Data Code API Response=>', watuApiResponse.data);
    console.log(
      'Watu  Data Code API Response for error sake=>',
      watuApiResponse.data
    );

    if (watuApiResponse.data.has_error == false) {
      const amountOptions = watuApiResponse.data.data.map((option) => {
        return {
          amount: option.amount,
          name: option.name,
          validity: option.validity,
          bundle_type: option.bundle_type,
        };
      });
      return res.status(200).json({
        amount_options: amountOptions,
      });
    } else if (watuApiResponse.data.status_code == 422) {
      const resultOptions = watuApiResponse.data.data.map((option) => {
        return {
          result: option[0],
        };
      });
      return res.status(400).json({ message: resultOptions });
    } else {
      return res
        .status(400)
        .json({ message: 'Failed to fetch data variations' });
    }
  } catch (error) {
    console.error('DATA VARIATION CODES ERROR=>', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};

// TO BUY AIRTIME BY USING VTPASS API
exports.dataSubscription = async (req, res) => {
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

  const body = DataSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  if (parseFloat(body.data.amount) > wallet.mainBalance) {
    return res.status(400).json({ error: 'Insufficient Balance' });
  }

  try {
    let billId;

    if (body.data.network.toLowerCase() === 'mtn') {
      billId = 'bill-18';
    } else if (body.data.network.toLowerCase() === 'airtel') {
      billId = 'bill-16';
    } else if (body.data.network.toLowerCase() === 'glo') {
      billId = 'bill-07';
    } else if (body.data.network.toLowerCase() === '9mobile') {
      billId = 'bill-19';
    } else {
      return res.status(400).json({
        errors: [
          {
            error: 'Invalid network selection',
          },
        ],
      });
    }
    let dataOrder = await Data.create({
      user: id,
      ...body.data,
    });

    const watuApiResponse = await axios.post(
      process.env.WATU_UTILITY_URL,
      {
        channel: billId,
        business_signature: process.env.BUSINESS_SIGNATURE,
        amount: body.data.amount,
        phone_number: body.data.phoneNumber,
        validity: body.data.validity,
        name: body.data.selectDataPlan,
        bundle_type: body.data.validity || '',
        ignore_duplicate: '1',
        // request_id: requestId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
        },
      }
    );

    // Update the order status and transaction details in the database
    wallet.mainBalance -= parseFloat(body.data.amount);
    await wallet.save();
    if (watuApiResponse.data.has_error == false) {
      dataOrder = await Data.findOneAndUpdate(
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
      // await dataOrder.save();
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
      dataOrder = await Data.findOneAndUpdate(
        { user: id },
        {
          $set: {
            status: 'failed',
            transactionId: watuApiResponse.data.data.transaction_reference,
          },
        },
        { new: true }
      );
      // await dataOrder.save();
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

    // await dataOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (dataOrder.status === 'completed') {
      const activity = new Activities({
        user: user._id,
        activityType: 'Bill Payment',
        description: 'Bill Payment Successful',
      });
      await activity.save();
      return res
        .status(200)
        .json({ message: watuApiResponse.data, dataOrder: dataOrder });
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
