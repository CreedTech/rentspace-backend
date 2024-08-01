const express = require('express');
const { Router } = express;

const { isAuthenticated } = require('../../middlewares/auth');
const {
  verifyMeterNumber,
  electricityRecharge,
} = require('../../controllers/electricity');

const router = Router();

// route POST api/verify-meter
// desc  for user to verify their meter number
// access public
router.post('/verify-meter', isAuthenticated, verifyMeterNumber);

// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post(
  '/buy-electricity',
  isAuthenticated,
  electricityRecharge
);
// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
// router.post(
//   '/buy-postpaid-electricity',
//   isAuthenticated,
//   electricityPostpaidRecharge
// );

module.exports = router;
