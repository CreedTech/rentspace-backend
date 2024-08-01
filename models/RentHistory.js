const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const RentHistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rent:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpaceRent",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    transactionReference: {
      type: String,
      required: true,
        },
        merchantReference: {
            type: String,
            required:true,
    },
    description: {
      type: String,
      required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        },
        fees: {
            type:String,
        },
        totalAmount: {
            type:String,
        }
    // Additional fields as needed...
  },
  {
    timestamps: true,
  }
);

module.exports = model('RentHistory', RentHistorySchema);
