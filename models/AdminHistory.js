const mongoose = require('mongoose');


const adminHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default:""
  },
  action: {
    type: String,
    enum: ['login', 'logout'],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  in: {
    type: Date,
  },
  out: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
  },
  // session: {
  //   type: String,
  //   required: true,
  // },
},
{ timestamps: true }
);

const AdminHistory = mongoose.model('AdminHistory', adminHistorySchema);

module.exports = AdminHistory;
