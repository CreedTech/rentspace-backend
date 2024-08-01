const axios = require('axios');
const User = require('../models/User');
const DVA = require('../models/DVA');
const BVN = require('../models/BVN');
const { DVASchema } = require('../validations/dva');
const Activities = require('../models/Activities');

exports.createDVA = async (req, res) => {
  const body = DVASchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  let user = await User.findOne({ email: body.data.email });
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: 'User not found',
        },
      ],
    });
  }
  let bvnInfo = await BVN.findOne({ user: user._id });
  if (!bvnInfo) {
    return res.status(404).json({
      errors: [
        {
          error: 'User BVN not found',
        },
      ],
    });
  }
  try {
    const checkUser = await User.findOne({
      email: body.data.email,
    });
    const userHasDVA = checkUser.has_dva;
    if (!userHasDVA) {
      const bankListResponse = await axios.get(
        'https://api.watupay.com/v1/virtual-account/supported-banks/NG',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
          },
        }
      );

      // Extract bank ID from the response
      const bankId = bankListResponse.data.data[0].id;

      const dvaData = {
        account_name: `${bvnInfo.lastName} ${bvnInfo.firstName}`,
        bank: bankId || 'ce262e37-d457-43a2-a52f-f03512413f62',
        prefix: 'BT',
        customer_email: user.email,
        customer_id: user.bvn,
        customer_id_type: 'BVN',
        institution_reference: 'rentspace_740121',
        customer_phone: user.phoneNumber,
      };

      const createDVAResponse = await axios.post(
        'https://api.watupay.com/v1/virtual-account/create',
        dvaData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
          },
        }
      );
      console.log(dvaData);
      console.log('Watu DVA API Response=>', createDVAResponse.data);

      if (createDVAResponse.data.status_code == 200) {
        const dvaCreation = await DVA.create({
          user: user._id,
          dvaName: createDVAResponse.data.data.account_name,
          customer_email: user.email,
          customer_id: user.bvn,
          institution_reference: 'rentspace_740121',
          customer_phone: user.phoneNumber,
          dvaNumber: createDVAResponse.data.data.account_id,
          dvaUsername: user.userName,
        });
        await dvaCreation.save();
        // Update the user in the database
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              has_dva: true,
              dva_name: createDVAResponse.data.data.account_name,
              dva_number: createDVAResponse.data.data.account_id,
              dva_username: user.userName,
            },
          },
          { new: true }
        );
        const activity = new Activities({
          user: user._id,
          activityType: 'DVA Creation',
          description: 'Virtual Account Created',
        });
        await activity.save();

        res.status(200).json({
          message: 'User DVA Updated Successfully',
          user,
        });
      } else {
        return res.status(400).json({ message: createDVAResponse.data });
      }
    } else {
      return res.status(400).json({
        error: 'User already has DVA',
      });
    }
  } catch (error) {
    console.error('DVA ERROR=>', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};

const getGenderCode = (gender) => {
  return gender.toLowerCase() === 'male'
    ? 1
    : gender.toLowerCase() === 'female'
      ? 2
      : 0;
};

exports.createSquadDVA = async (req, res) => {
  const body = DVASchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  let user = await User.findOne({ email: body.data.email });
  if (!user) {
    return res.status(404).json({
      errors: [
        {
          error: 'User not found',
        },
      ],
    });
  }
  try {
    const checkUser = await User.findOne({
      email: body.data.email,
    });
    const findBVN = await BVN.findOne({
      user: user._id,
    });
    const dateString = findBVN.dob;
    const parts = dateString.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    console.log(formattedDate); // Output: 26/05/2002

    const gender = getGenderCode(user.gender);
    const userHasDVA = checkUser.has_dva;
    if (!userHasDVA) {
      // const bankListResponse = await axios.get(
      //   "https://api.watupay.com/v1/virtual-account/supported-banks/NG",
      //   {

      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //       "Authorization": `Bearer ${process.env.WATU_LIVE_SECRET_KEY}`,
      //     }
      //   }
      // );

      // Extract bank ID from the response
      // const bankId = bankListResponse.data.data[0].id;

      const dvaData = {
        customer_identifier: `${findBVN.lastName} ${findBVN.firstName}`,
        first_name: findBVN.firstName,
        last_name: findBVN.lastName,
        mobile_num: findBVN.mobile,
        email: user.email,
        bvn: findBVN.bvn,
        dob: formattedDate,
        address: user.residential_address,
        gender: gender,
      };

      const createDVAResponse = await axios.post(
        'https://api-d.squadco.com/virtual-account',
        dvaData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SQUAD_LIVE_SECRET_KEY}`,
          },
        }
      );
      console.log(dvaData);
      console.log('Watu DVA API Response=>', createDVAResponse.data);

      if (createDVAResponse.data.status_code == 200) {
        const dvaCreation = await DVA.create({
          user: user._id,
          dvaName: createDVAResponse.data.data.account_name,
          customer_email: user.email,
          customer_id: user.bvn,
          institution_reference: 'rentspace_740121',
          customer_phone: user.phoneNumber,
          dvaNumber: createDVAResponse.data.data.account_id,
          dvaUsername: user.userName,
        });
        await dvaCreation.save();
        // Update the user in the database
        user = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              has_dva: true,
              dva_name: createDVAResponse.data.data.account_name,
              dva_number: createDVAResponse.data.data.account_id,
              dva_username: user.userName,
            },
          },
          { new: true }
        );
        const activity = new Activities({
          user: user._id,
          activityType: 'DVA Creation',
          description: 'Virtual Account Created',
        });
        await activity.save();

        res.status(200).json({
          message: 'User DVA Updated Successfully',
          user,
        });
      } else {
        return res.status(400).json({ message: createDVAResponse.data });
      }
    } else {
      return res.status(400).json({
        error: 'User already has DVA',
      });
    }
  } catch (error) {
    console.error('DVA ERROR=>', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};

/*
curl -X POST \
  'https://api-d.squadco.com/virtual-account' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: sk_5e03078e1a38fc96de55b1ffaa712ccb1e30965d' \
  -d '{
        "customer_identifier": "OKOYE CHUKWUEBUKA",
        "first_name": "CHUKWUEBUKA",
        "last_name": "OKOYE",
        "mobile_num": "07030715791",
        "email": "okoyeebuka25@gmail.com",
        "bvn": "22486191182",
        "dob": "05/25/2000",
        "address": "34, Monsuru Bisiriyul street",
        "gender": "1"
    }'

*/




exports.getUserDVA = async (req, res) => {
  const { id } = req.user;
  try {
    const dva = await DVA.findOne({ user: id }).populate('user');
    if (!dva) return res.status(400).json({ error: 'No DVA Found' });

    return res.status(200).json({ msg: 'DVA Info Successfully Fetched', dva });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};

// TO GET ALL SPACERENTS
exports.getAllDVAs = async (req, res) => {
  try {
    const dvas = await DVA.find().populate('user', '-password');
    res.status(200).json({
      dvas,
    });
  } catch (error) {
    console.log('GET ALL DVAs ERROR', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};
