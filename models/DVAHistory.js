const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const DVAHistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // transactionType: {
    //   type: String,
    //   enum: ['deposit', 'withdrawal', 'payment', 'refund'], // Example transaction types
    //   required: true,
    // },
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
        },
        type: {
            type:String,
        }
    // Additional fields as needed...
  },
  {
    timestamps: true,
  }
);

module.exports = model('DVAHistory', DVAHistorySchema);
