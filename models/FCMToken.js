const mongoose = require('mongoose');

const fcmTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
    },
    deviceType: {
      type: String,
    },
    deviceName: {
      type: String,
    },
  },
  { timestamps: true }
);

const FCMToken = mongoose.model('FCMToken', fcmTokenSchema);

module.exports = FCMToken;
