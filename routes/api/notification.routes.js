const express = require("express");

const { isAuthenticated } = require("../../middlewares/auth");
const { sendNotification } = require("../../controllers/pushNotifications");




const { Router } = express;

const router = Router();

router.post("/send", sendNotification);

module.exports = router;


