const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserInfoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
      },
      activities: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activities",
    },
      
},
{
  timestamps: true,
    });

    UserInfoSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user wallet activities',
    // select: 'pin isPinSet walletId mainBalance',
  });
  next();
});

module.exports = model("UserInfo", UserInfoSchema);