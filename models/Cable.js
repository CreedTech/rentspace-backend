const mongoose = require('mongoose');
const { Schema } = mongoose;

const CableSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  smartCardNumber: {
    type: String,
    required: true,
    trim: true,
  },
  productCode: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  requestId: {
    type: String,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model(
  'Cable',
  CableSchema
);
