const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const BVNSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bvn: {
        type: String,
        required: true
    },
    dob: {
        type: String,
    },
    transaction_ref: {
        type: String,
    },
    firstName: {
        type:String,
    },
    mobile: {
        type:String
    },
    lastName: {
        type:String
    },
    middleName: {
        type:String
    },
    photo: {
        type:String
    }
},
    { timestamps: true }
);

module.exports = model("BVN", BVNSchema);
