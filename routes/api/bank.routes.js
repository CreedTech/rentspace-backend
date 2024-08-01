const express = require("express");

const { isAuthenticated } = require("../../middlewares/auth");
const { getBankList, accountDetails } = require("../../controllers/banks");



const { Router } = express;

const router = Router();

router.get("/bank-lists",isAuthenticated, getBankList);
router.post("/verfiy-account",isAuthenticated, accountDetails);

module.exports = router;
