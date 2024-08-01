const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BVNDebitSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bvn: {
        type: String,
      required: true  
    },
    amount: {
        type: Number,
        required: true,
    },
    charge: {
        type: Number,
        required:true
    },
    transactionId: {
        type: String,
        required: true,
    },
    verificationType: {
        type: String,
        enum: ['BVN Verification'],
        required: true,
    },
    date: {
        type:Date,
    }
},
{ timestamps: true }
);


module.exports = model("BVNDebit", BVNDebitSchema);