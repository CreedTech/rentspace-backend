const axios = require("axios");
const User = require("../models/User");
const Banks = require("../models/Banks");
const { AccountSchema } = require('validations/account');

exports.getBankList = async (req, res) => {
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
    try {
        const existingBanks = await Banks.findOne();

        // If the database already has the banks data, don't update it again
        // if (existingBanks) {
        //     // Return the existing banks data or do nothing
        //     const banksArray = Object.values(existingBanks);

        //     return res.status(200).json({ message: 'Banks data already exists', banks: banksArray });
        // }
        
        // If the database doesn't have the banks data, fetch and save it
        const bankListResponse = await axios.get(
            "https://api.watupay.com/v1/country/NG/financial-institutions",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`,
                }
            }
        );
        
        if (bankListResponse.data.status_code == 200) {
            const banksData = bankListResponse.data.data;
            // const banks = new Banks(banksData);
            // await banks.save();
            return res.status(200).json({ message: 'Banks data fetched and saved successfully', banks: banksData });
        } else {
            return res.status(400).json({ message: bankListResponse.data });
        }
    } catch (error) {
        console.error('BANK LIST ERROR=>', error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }
}

exports.accountDetails = async (req, res) => {
    const {id} = req.user
    const user = await User.findById(id)
    if(!user){
        return res.status(404).json({
            errors: [{
                error: "User not found",
            }, ],
        });
    }
    const body = AccountSchema.safeParse(req.body);
    if(!body.success) {
      return res.status(400).json({errors: body.error.issues})
    }

    let data = JSON.stringify({
        "data": [
          {
            "financial_institution": body.data.financial_institution,
            "account_id": body.data.account_id
          }
        ]
      });
    try {
        const bankData = {
            financial_institution: body.data.financial_institution,
            account_id: body.data.account_id,
        };
        
        const accountDetailsResponse = await axios.post(
            "https://api.watupay.com/v1/financial-institution/verify",
            data,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json',
                    "Authorization": `Bearer ${process.env.WATU_LIVE_PUBLIC_KEY}`
                }
            }
        );
        console.log(bankData);
        console.log('WATU ACCOUNT DETAILS API Response=> ', accountDetailsResponse.data);

        if (accountDetailsResponse.data.status_code == 200) {
            
            const accountsData = accountDetailsResponse.data.data;
            return res.status(200).json({ message: 'Banks data fetched and saved successfully', account: accountsData });
        }
        return res.status(400).json({ message: accountDetailsResponse.data });
      
    } catch (error) {
        console.error('ACCOUNT DETAILS ERROR=>', error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }
}