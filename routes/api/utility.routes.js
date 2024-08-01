const express = require("express");

const { isAuthenticated } = require("../../middlewares/auth");
const { addUtilityHistory, getUtility, getAllUtilities } = require("../../controllers/utility");
const { verifyTVNumber } = require("../../controllers/cable");



const { Router } = express;

const router = Router();

router.get("/utility-history",isAuthenticated, getUtility);
router.post("/add-utility",isAuthenticated, addUtilityHistory);
router.get("/all-utilities",isAuthenticated, getAllUtilities);

module.exports = router;
