const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UtilityHistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    biller: {
      type: String,
      required: true,
    },
    userUtilityNumber: {
      type: String,
      required: true,
    },
    transactionReference: {
      type: String,
      required: true,
    },
    merchantReference: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    fees: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    // Additional fields as needed...
  },
  {
    timestamps: true,
  }
);

module.exports = model("UtilityHistory", UtilityHistorySchema);
