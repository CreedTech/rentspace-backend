const express = require('express');

const { isAuthenticated, restrictTo } = require('../../middlewares/auth');
const {
  createSpaceRent,
  getUserSpaceRent,
  getAllSpaceRents,
  createRentPaymentAndSpaceRent,
  getRentHistories,
  calculateAllRentsAmount,
  deleteUserSpaceRent,
} = require('../../controllers/spacerent');
const {
  fundRentWithWallet,
  calculateNextPaymentDate,
} = require('../../controllers/paymentController');

const { Router } = express;

const router = Router();

router.post('/create-rent', isAuthenticated, createSpaceRent);
router.post('/fund-rentWithWallet', isAuthenticated, fundRentWithWallet);
router.post('/calc-nextPaymentDate', isAuthenticated, calculateNextPaymentDate);
router.post(
  '/create-rentAndPayment',
  isAuthenticated,
  createRentPaymentAndSpaceRent
);
router.get('/get-rent', isAuthenticated, getUserSpaceRent);
router.get('/get-rentHistories', isAuthenticated, getRentHistories);
router.get(
  '/get-rents',
  isAuthenticated,
  restrictTo(
    'account',
    'super-admin',
    'admin',
    'marketing',
    'tester',
    'sales'
  ),
  getAllSpaceRents
);
router.get(
  '/get-rentTotal',
  isAuthenticated,
  restrictTo(
    'account',
    'super-admin',
    'admin',
    'marketing',
    'tester',
    'sales'
  ),
  calculateAllRentsAmount
);
router.delete(
  '/delete-rent/:rentspace_id',
  isAuthenticated,
  deleteUserSpaceRent
);

module.exports = router;
