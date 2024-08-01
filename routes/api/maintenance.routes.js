const express = require("express");
const { Router } = express;
const { isAuthenticated,restrictTo } = require("../../middlewares/auth");
const { getAppMaintenanceStatus, updateMaintenanceStatus } = require("../../controllers/maintenance");

const router = Router();

// route GET api/app-status
// desc  to get the app Maintenance status
// access private
router.get("/app-status", isAuthenticated, getAppMaintenanceStatus);

// route PUT api/app-status
// desc get admin History
// access private
router.put("/app-status", isAuthenticated,restrictTo('super-admin', 'admin'), updateMaintenanceStatus);

module.exports = router;