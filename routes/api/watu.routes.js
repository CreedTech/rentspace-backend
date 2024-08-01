const express = require("express");

const { isAuthenticated } = require("../../middlewares/auth");
const { createPayment, webhooks, getWebhooks, createRentPayment } = require("../../controllers/paymentController");



const { Router } = express;

const router = Router();

router.post("/create-payment", isAuthenticated, createPayment);
router.post("/create-rentPayment", isAuthenticated, createRentPayment);
router.post("/webhook", webhooks);
router.get("/all-webhook",isAuthenticated, getWebhooks);

module.exports = router;
