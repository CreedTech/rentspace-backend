const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const DVASchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        dvaName: {
            type: String,
            required: true,
        },
        customer_email: {
            type: String,
            required: true,
        },
        prefix: {
            type: String,
            default: "BT"
        },
        customer_id: {
            type: String,
            required:true,
        },
        customer_id_type: {
            type: String,
            default:'BVN'
        },
        institution_reference: {
            type: String,
        },
        customer_phone: {
            type: String,
            required: true,
        },
        bank: {
            type: String,
            
        },
        dvaNumber: {
            type: String,
            default: ""
        },
        dvaUsername: {
            type: String,
            required: true,
        },
        dvaDate:  {
            type: Date,
            default: Date.now,
        }
    }
);

module.exports = model("DVA", DVASchema);