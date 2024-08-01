const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SpaceRentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rentName: {
      type: String,
      required: true,
      default: "Space Rent",
    },
    rentspace_id: {
      type: String,
      unique: true,
    },
    current_payment: {
      type: Number,
      required: true,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
    has_paid: {
      type: Boolean,
      default: false,
      required: true,
    },
    next_date: {
      type: String,
      required: true,
    },
    due_date: {
      type: String,
      required: true,
    },
    interval: {
      type: String,
      enum: ["Weekly", "Monthly"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_count: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    interval_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paid_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    spaceRentInterest: {
      type: Number,
      default: 0,
    },
    payment_status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },
    duration: {
      type: String,
      enum: ["5", "6", "7", "8"],
      default: 5,
    },
    token: {
      type: String,
      default: "",
    },
    isStopped: {
      type: Boolean,
      default: false,
      required: true,
    },
    firstPayment: {
      type: Boolean,
      default: true,
      required: true,
    },
    payment_type: {
      type: String,
      enum: ["DVA Wallet", "Debit Card"],
      default: "DVA Wallet",
    },
    failedDebitCount: {
      type: Number,
      default: 0,
    },

    rentHistories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RentHistory",
      },
    ],
    spaceRentInterestHistories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpaceRentInterestHistory",
      },
    ],
    loanApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanApplication",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("SpaceRent", SpaceRentSchema);
