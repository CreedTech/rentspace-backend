const express = require("express");

const { isAuthenticated, restrictTo } = require("../../middlewares/auth");
const { createProvidusVirtualAccount, getProvidusAccountDetails, getNIPAccountDetails } = require("../../controllers/providusVirtualAccount");
const { providusWebhook } = require("../../controllers/paymentController");



const { Router } = express;

const router = Router();

router.post("/get-providus-account", isAuthenticated, getProvidusAccountDetails);
router.post("/get-nip-account", isAuthenticated, getNIPAccountDetails);




router.post("/create-providus-reserved-account", createProvidusVirtualAccount);

router.post("/providus-webhook", providusWebhook);
// router.get("/get-dva", isAuthenticated, getUserDVA);
// router.get("/get-dvas", isAuthenticated, restrictTo('super-admin', 'admin'), getAllDVAs);

module.exports = router;
