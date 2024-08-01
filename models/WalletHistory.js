const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WalletHistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["Credit", "Debit", "payment", "refund"], // Example transaction types
      default: "Credit",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    transactionReference: {
      type: String,
    },
    merchantReference: {
      type: String,
    },
    sessionId: {
      type: String,
    },
    transactionGroup: {
      type: String,
      default: "Payment",
    },
    description: {
      type: String,
    },
    remarks: {
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
      type: String,
      default: 0,
    },
    totalAmount: {
      type: String,
    },
    paymentGateway: {
      type: String,
      default: "providus",
    },
    userUtilityNumber: {
      type: String,
    },
    biller: {
      type: String,
    },
    accountName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

WalletHistorySchema.index({ description: "text", message: "text" });

module.exports = model("WalletHistory", WalletHistorySchema);
