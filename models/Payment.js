const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

        reference: {
            type: String,
            required:true,
    },

        message: {
            type: String,
        },
        status_code: {
            type: Number,
    },
    status: {
      type: String,
       default: "pending",
     }, 

        transactionId: {
            type: String,
          },
    // Additional fields as needed...
  },
  {
    timestamps: true,
  }
);

module.exports = model('Payment', PaymentSchema);
