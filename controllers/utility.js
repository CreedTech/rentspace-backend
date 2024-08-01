const axios = require("axios");
const User = require("../models/User");
const Wallet = require("../models/Wallet")
const {ValidateBillSchema,UtilityHistorySchema} = require('../validations/utility');
const UtilityHistory = require("../models/UtilityHistory");
const { generateRequestId } = require("../helpers/airtimeRecharge");
const Activities = require("../models/Activities");
const WalletHistory = require("../models/WalletHistory");

exports.vendBet = async (req, res) => {
    const { id } = req.user;
    let user;
     user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }
    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) throw new Error("Wallet not found");
    

}

exports.validateBill = async (req, res) => {
    const { id } = req.user;
    let user;
     user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }
    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) throw new Error("Wallet not found");

    const body = ValidateBillSchema.safeParse(req.body)
    
    if(!body.success) {
        return res.status(400).json({errors: body.error.issues})
    }

    try {
        const validateResponse = await axios.post(
            'https://api.watupay.com/v1/watubill/validate',
            {
                channel: body.data.channel,
                account_number: body.data.accountNumber,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
            }
        }
        )
        console.log('Watu Utility API Response=>', validateResponse.data);
        if (validateResponse.data.has_error == false) {
            const validateBillInfo = validateResponse.data.data;
            res.status(200).json({
                message: "Info Validated Successfully",
              
                validateBillInfo
              });
        }else {
            return res.status(400).json({"msg":validateResponse.data.data.message, message: validateResponse.data.data });
        }
    } catch (error) {
        console.error('VALIDATE INFO ERROR=>', error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }




    
}

exports.addUtilityHistory = async (req, res) => {
    const { id } = req.user;
    let user;
    let wallet;
     user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }


    const body = UtilityHistorySchema.safeParse(req.body);
    
    if(!body.success) {
        return res.status(400).json({ errors: body.error.issues });
    }
try {
    wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) throw new Error("Wallet not found");
    const referenceId = generateRequestId();
    wallet.mainBalance -= parseFloat(body.data.amount);
    
    await wallet.save();
   

    const utilityHistory = await UtilityHistory.create({
        user: wallet.user, // Assuming 'user' field is populated in Space model
        transactionReference: referenceId,
        transactionType: body.data.transactionType,
        amount: body.data.amount,
        currency: "NGN",
        fees: 0,
        biller: body.data.biller,
         totalAmount: body.data.amount,
        merchantReference:referenceId,
        status: "Completed",
        description:body.data.description,
        // Add other fields as needed
    });
    await utilityHistory.save();
    user = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
            $set: {
                utility_points: user.utility_points + 1,
          },
        },
        { new: true }
    );
    await user.save();
    const activity = new Activities({ user:wallet.user._id, activityType :body.data.biller, description: body.data.description ,});
    await activity.save();

    return res
    .status(200)
    .json({ msg: "Bill Paid Succesfully", utilityHistory });
} catch   (error) {
    console.error('BILL PAYMENT ERROR=>', error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }

}

exports.getUtility = async (req, res) => {
    try {
        const {id} = req.user
        console.log("ID=>", id)
        const user = await User.findById(id)
        console.log("USER=>", user)
        if (!user) {
            return res.status(404).json({
                errors: [{
                    error: "User not found",
                }, ],
            });
        }
        const utilityHistories = await UtilityHistory.find({user:id}).sort({ timestamp: -1 }).populate("user").exec()
        // if(!utilityHistories){
        //     return res.status(404).json({
        //         errors: [{
        //             error: "User's Utility Histories not found",
        //         }, ],
        //     });
        // }
        if (utilityHistories) {
            return res.status(200).json({ msg: "User Utility Histories Successfully Fetched", utilityHistories });
            
        }
        
    
        } catch (error) {
            console.log("ERROR GETING USER UTILITY HISTORIES=>", error)
            res.status(500).json({
              errors: [
                {
                  error: "Server Error",
                },
              ],
            });
          }
}

exports.getAllUtilities = async (req, res) => {
    try {
        const utilityHistories = await WalletHistory.find({
            transactionGroup: 'bill',
          })
          .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
          .populate('user', '-password');
        res.status(200).json({
          utilityHistories,
        });
      } catch (error) {
        console.log('GET ALL UTILITIES  ERROR', error);
        res.status(500).json({
          errors: [
            {
              error: 'Server Error',
            },
          ],
        });
      }
    };