const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProvidusSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accountName: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    customer_id_type: {
      type: String,
      default: "BVN",
    },
    institution_reference: {
      type: String,
    },
    customer_phone: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Providus", ProvidusSchema);
