const express = require("express");
const { Router } = express;
const { isAuthenticated } = require("../../middlewares/auth");
const {
  airtimeRecharge,
  queryTransactionStatus,
  getAllAirtimeTransactions,
  VFDfetchBillerCategory,
  getVFDBillerList,
  getVFDBillerItems,
  payVFDBill,
  validateVFDCustomer,
  getVFDTransactionStatus,
} = require("../../controllers/airtime");
const rateLimiter = require("../../utils/rate-limiter");

const router = Router();

// route POST api/buy-airtime
// desc  for user to buy airtime
// access private
router.post("/buy-airtime", isAuthenticated, airtimeRecharge);

// route POST api/buy-airtime/query
// desc  to get the transaction status
// access private
router.post("/buy-airtime/query", isAuthenticated, queryTransactionStatus);

// route GET api/query
// desc  to get the transaction status
// access private
router.get("/get-airtimes", isAuthenticated, getAllAirtimeTransactions);

router.get("/get-vfd-biller-categories", isAuthenticated, VFDfetchBillerCategory);
router.get("/get-vfd-biller-list", isAuthenticated, getVFDBillerList);
router.get("/get-vfd-biller-items", isAuthenticated, getVFDBillerItems);
router.post("/pay-vfd-bill", isAuthenticated, rateLimiter, payVFDBill);
router.post("/validate-vfd-customer",isAuthenticated, validateVFDCustomer);
router.get("/get-vfd-transaction-status",isAuthenticated, getVFDTransactionStatus);

module.exports = router;
