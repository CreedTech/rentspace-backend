const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SpaceWalletInterestHistorySchema = new Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    interestAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('SpaceWalletInterestHistory', SpaceWalletInterestHistorySchema);
