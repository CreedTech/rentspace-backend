const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activities",
      },
    ],
    walletHistories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WalletHistory",
      },
    ],
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    residential_address: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      updated: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    referrals: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: String,
      default: "",
    },
    referralPoints: {
      type: Number,
      default: 0,
    },
    referredPoints: {
      type: Number,
      default: 0,
    },
    referral_code: { type: String, unique: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    date_of_birth: {
      type: String,
      required: true,
    },
    bvn: {
      type: String,
      default: "",
    },
    kyc: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
    },
    otpExpireIn: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: [
        "user",
        "account",
        "super-admin",
        "admin",
        "marketing",
        "tester",
        "sales",
      ],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    has_bvn: {
      type: Boolean,
      default: false,
    },
    has_dva: {
      type: Boolean,
      default: false,
    },
    has_received_referral_bonus: {
      type: Boolean,
      default: false,
    },
    has_rent: {
      type: Boolean,
      default: false,
    },
    has_verified_bvn: {
      type: Boolean,
      default: false,
    },
    has_verified_email: {
      type: Boolean,
      default: false,
    },
    has_verified_kyc: {
      type: Boolean,
      default: false,
    },
    has_verified_phone: {
      type: Boolean,
      default: false,
    },
    defaultBank: {
      type: String,
      default: "watu",
    },
    dva_name: {
      type: String,
      default: "",
    },
    dva_number: {
      type: String,
      default: "",
    },
    dva_username: {
      type: String,
      default: "",
    },
    utility_points: {
      type: Number,
      default: 0,
    },
    rentspace_id: {
      type: String,
      default: "",
    },
    card_cvv: {
      type: String,
      default: "",
    },
    card_digit: {
      type: String,
      default: "",
    },
    card_expire: {
      type: String,
      default: "",
    },
    id_card: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    loan_amount: {
      type: Number,
      default: 0,
    },
    finance_health: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["verified", "unverified", "suspended", "locked"],
      default: "unverified",
    },
    total_assets: {
      type: Number,
      default: 0,
    },
    total_interests: {
      type: Number,
      default: 0,
    },
    total_debts: {
      type: Number,
      default: 0,
    },
    total_profits: {
      type: Number,
      default: 0,
    },
    total_savings: {
      type: Number,
      default: 0,
    },
    wallet_id: {
      type: String,
    },
    wallet_balance: {
      type: Number,
      default: 0,
    },
    pin: {
      type: String, // Use string, so it can be hashed and saved to db.
      default: "",
    },
    isPinSet: {
      type: Boolean,
      default: false,
    },
    withdrawalAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WithdrawalAccount",
      unique: true,
    },
    loanApplications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LoanApplication",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// UserSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'wallet',
//     select: 'pin isPinSet walletId mainBalance',
//   });
//   next();
// });

UserSchema.index({ firstName: "text", lastName: "text", email: "text" });
module.exports = model("User", UserSchema);
