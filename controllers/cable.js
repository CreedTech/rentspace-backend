const axios = require('axios');
const {
  // CableSchema,
  CableSchema,
  CableVerificationSchema,
  CableBillPaymentSchema,
} = require('../validations/cable');
const User = require('../models/User');
const Cable = require('../models/Cable');
const Wallet = require('../models/Wallet');
const UtilityHistory = require('../models/UtilityHistory');
const WalletHistory = require('../models/WalletHistory');
const { calculateSpacePoint } = require('../helpers/spacePoint');

exports.getTV = async (req, res) => {
  try {
    const body = CableSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }
    const watuApiResponse = await axios.post(
      'https://api.watupay.com/v1/watubill/bill-types',
      {
        channel: body.data.billingServiceID,
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
      const tvSubs = watuApiResponse.data.data.map((option) => {
        return {
          name:option.name,
          product_code: option.product_code,
          amount: option.amount,
          validity: option.validity,
          invoice_period: option.invoice_period,
        };
      });

      return res.status(200).json({
        message: 'Meter verification successful',
        tvSubs: tvSubs,
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
exports.validateTV = async (req, res) => {
  try {
    const body = CableVerificationSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }
    const watuApiResponse = await axios.post(
      process.env.WATU_UTILITY_VALIDATE_URL,
      {
        channel: body.data.billingServiceID,
        smart_card_number: body.data.smartCardNumber,
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
      const { first_name, last_name, account_status } = watuApiResponse.data.data;

      return res.status(200).json({
        message: 'TV verification successful',
        firstName: first_name,
        // meterNumber: Meter_Number,
        lastName: last_name,
        accountStatus: account_status,
      });
    } else if (watuApiResponse.data.status_code == 422) {
      return res.status(400).json({
        errors: [
          {
            error: 'SmartCard verification failed',
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
    console.error('SmartCard Verification Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.cableRecharge = async (req, res) => {
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

  const body = CableBillPaymentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  if (parseFloat(body.data.amount) > wallet.mainBalance) {
    return res.status(400).json({ error: 'Insufficient Balance' });
  }

  try {
    const cableOrder = await Cable.create({
      user: id,
      ...body.data,
      // requestId: generateRequestId(),
    });

    // const requestId = generateRequestId();

    const watuApiResponse = await axios.post(
      process.env.WATU_UTILITY_URL,
      {
        channel: body.data.billingServiceID,
        amount: body.data.amount,
        months_paid_for: '1',
        invoice_period: body.data.invoicePeriod,
        product_code: body.data.productCode,
        business_signature: process.env.BUSINESS_SIGNATURE,
        smart_card_number: body.data.smartCardNumber,
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
      cableOrder = await Cable.findOneAndUpdate(
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
      // await cableOrder.save();
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
      cableOrder = await Cable.findOneAndUpdate(
        { user: id },
        {
          $set: {
            status: 'failed',
            transactionId: watuApiResponse.data.data.transaction_reference,
          },
        },
        { new: true }
      );
      // await cableOrder.save();
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

    // await cableOrder.save();
    //TODO
    // Send a confirmation email to the user

    if (cableOrder.status === 'completed') {
      const activity = new Activities({
        user: user._id,
        activityType: 'Bill Payment',
        description: 'Bill Payment Successful',
      });
      await activity.save();
      return res.status(200).json({
        message: watuApiResponse.data.data.bill_data.Token,
        cableOrder: cableOrder,
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