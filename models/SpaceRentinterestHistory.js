const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const SpaceRentInterestHistorySchema = new Schema(
  {
    spaceRent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SpaceRent',
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

module.exports = model('SpaceRentInterestHistory', SpaceRentInterestHistorySchema);
