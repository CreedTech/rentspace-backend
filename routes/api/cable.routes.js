const express = require('express');
const { Router } = express;

const { isAuthenticated } = require('../../middlewares/auth');

const { getTV, validateTV, cableRecharge } = require('../../controllers/cable');

const router = Router();

// route POST api/verify-meter
// desc  for user to verify their meter number
// access public

// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post('/get-tv', isAuthenticated, getTV);
router.post('/validate-tv', isAuthenticated, validateTV);
router.post('/vend-tv', isAuthenticated, cableRecharge);
// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
// router.post(
//   '/buy-postpaid-electricity',
//   isAuthenticated,
//   electricityPostpaidRecharge
// );

module.exports = router;
