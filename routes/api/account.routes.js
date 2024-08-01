const express = require("express");

const { isAuthenticated, restrictTo } = require("../../middlewares/auth");
const { addAccountDetails, getAccountDetails, getAllAccountDetails } = require("../../controllers/account");




const { Router } = express;

const router = Router();

router.post("/add-account", isAuthenticated, addAccountDetails);
router.get("/get-account", isAuthenticated, getAccountDetails);
router.get("/get-accounts", isAuthenticated, restrictTo('super-admin', 'admin'), getAllAccountDetails);

module.exports = router;
