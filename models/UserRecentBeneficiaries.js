const mongoose = require("mongoose");

const recentTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accountNumber: {
      type: String,
      required: true,
    },
    bankCode: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

const RecentTransaction = mongoose.model(
  "RecentTransaction",
  recentTransactionSchema
);

module.exports = RecentTransaction;
