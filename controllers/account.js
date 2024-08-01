const axios = require("axios");
const User = require("../models/User");
const AccountDetail = require("../models/Account");
const AccountSchema = require("../validations/user");

exports.getAccountDetails = async (req, res) => {
    const { id } = req.user;
    try {
        const accountDetail = await AccountDetail.find({ user: id }).populate("user");
        if (!accountDetail) return res.status(400).json({ error: 'No Account Details Found' });
    
        return res.status(200).json({ msg: "Account Details Successfully Fetched",accountDetail });
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
}

exports.addAccountDetails = async (req, res) => {
    const { id } = req.user;
    let user;
    user = await User.findById(id)
    if (!user) {
        return res.status(404).json({
            errors: [{
                error: "User not found",
            },],
        });
    }
    const body = AccountSchema.safeParse(req.body);

    if (!body.success) return res.status(400).json({ error: body.error.issues });

    try {
        const accountDetails = new AccountDetail({ accountName:body.data.accountName,  bankName: body.data.bankName , accountDate: new Date()});
        await accountDetails.save();
        return res
        .status(201)
        .json({ message: "Account Details Created Succesfully", accountDetails });
    } catch (error) {
        console.log("CREATE ACCOUNT DETAILS ERROR=>", error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
              details: error.message,
            },
          ],
        });
      }
}

exports.getAllAccountDetails = async (req, res) => {
    try {
        const accountDetails = await AccountDetail.find();
        res.status(200).json({
            accountDetails,
        });
      } catch (error) {
        console.log("GET ALL ACCOUNT DETAILS ERROR", error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }
}