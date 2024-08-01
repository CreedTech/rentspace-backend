const { AppError } = require("../helpers/error");
const Activities = require("../models/Activities");
const BVN = require("../models/BVN");
const DVA = require("../models/DVA");
const User = require("../models/User");
const axios = require('axios');

exports.createUserDva = async (email) => {

    let user = await User.findOne({ email: email });
    if (!user) {
        throw new AppError(404, "User not found");
    //   return res.status(404).json({
    //     errors: [
    //       {
    //         error: 'User not found',
    //       },
    //     ],
    //   });
    }
    let bvnInfo = await BVN.findOne({ user: user._id });
    if (!bvnInfo) {
        throw new AppError(404, "User BVN not found");
    //   return res.status(404).json({
    //     errors: [
    //       {
    //         error: 'User BVN not found',
    //       },
    //     ],
    //   });
    }
    try {
      const checkUser = await User.findOne({
        email: email,
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
            return user;
        //   res.status(200).json({
        //     message: 'User DVA Updated Successfully',
        //     user,
        //   });
        } else {
            throw new AppError(400, createDVAResponse.data);
        //   return res.status(400).json({ message: createDVAResponse.data });
        }
      } else {
        throw new AppError(400, "User already has DVA");
        // return res.status(400).json({
        //   error: 'User already has DVA',
        // });
      }
    } catch (error) {
        console.error('DVA ERROR=>', error);
        throw new AppError(500, "Server Error");
    //   res.status(500).json({
    //     errors: [
    //       {
    //         error: 'Server Error',
    //       },
    //     ],
    //   });
    }
}