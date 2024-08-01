const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ReferralsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    referrals: {
      type: Number,
      default: 0,
    },
    referredBy: {
      type: String,
      default: '',
    },
    referralPoints: {
      type: Number,
      default: 0,
    },
    referredPoints: {
      type: Number,
      default: 0,
    },
    referralCode: { type: String, default: '' },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    has_received_referral_bonus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Referrals", ReferralsSchema);