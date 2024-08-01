const express = require('express');

const { isAuthenticated, restrictTo } = require('../../middlewares/auth');
const { verifyBVN, bvnDebit, getAllBVN, youverifyBVNLookup } = require('../../controllers/bvn');

const { Router } = express;

const router = Router();

// router.post('/verify-bvn', verifyBVN);
router.post('/verify-bvn', youverifyBVNLookup);
router.post('/bvn-debit', isAuthenticated, bvnDebit);
router.get(
  '/all-bvn',
  isAuthenticated,
  restrictTo(
    'super-admin',
    'admin',
  ),
  getAllBVN
);

module.exports = router;


