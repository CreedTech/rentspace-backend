const mongoose = require("mongoose");

const adminControlSchema = new mongoose.Schema({
  status: {
    type: String,
        required: true,
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "7d",
    },
},  {
    timestamps: true,
  }
);

const AdminControl = mongoose.model("AdminControl", adminControlSchema);

module.exports = AdminControl;
