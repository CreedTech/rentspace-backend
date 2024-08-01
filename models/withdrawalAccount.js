const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WithdrawalAccountSchema = new Schema(
  {
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("WithdrawalAccount", WithdrawalAccountSchema);
