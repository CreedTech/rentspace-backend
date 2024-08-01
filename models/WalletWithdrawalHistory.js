const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WalletWithdrawalHistorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
      },
      transactionReference: {
        type: String,
          },
          merchantReference: {
              type: String,
    },
    description: {
        type: String,
          },
          message: {
              type: String,
          },
          status: {
              type: String,
              default: "pending",
          },
          fees: {
              type:String,
          },
          totalAmount: {
              type:String,
          }
    
},
{
  timestamps: true,
    });

    module.exports = model('WalletWithdrawalHistory', WalletWithdrawalHistorySchema);