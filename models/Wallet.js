const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WalletSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pin: {
      type: String,
      default: "",
    },
    isPinSet: {
      type: Boolean,
      default: false,
    },
    walletId: {
      type: String,
    },
    mainBalance: {
      type: Number,
      default: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    accumulatedInterest: {
      type: Number,
      default: 0,
    },
    monthlyAccumulatedInterest: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
    otpExpireIn: {
      type: Number,
    },
    lastWithdrawalDate: {
      type: Date,
    },
    nextWithdrawalDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Wallet", WalletSchema);
