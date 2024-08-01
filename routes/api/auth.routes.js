const { isAuthenticated } = require("../../middlewares/auth");
const {
  verifyUser,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  sendDeviceLoginOtp,
  verifyDeviceLoginOtp
} = require("../../controllers/user");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/auth/verify
// desc  verify user
// access public
router.post("/verify", verifyUser);

// route POST api/auth/password/forgot-password
// desc  generate forgot-password OTP
// access public
router.post("/password/forgot-password", forgotPasswordOtp);

// route POST api/auth/password/verify
// desc  verify otp
// access public
router.post("/password/verify", verifyForgotPasswordOtp);

// route POST api/auth/password/reset-password
// desc verify otp
// access public
router.post("/password/reset-password", resetPassword);
router.post("/single-device-login-otp", sendDeviceLoginOtp);
router.post("/verify-single-device-login-otp", verifyDeviceLoginOtp);

module.exports = router;
