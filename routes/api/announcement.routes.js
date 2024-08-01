const express = require("express");
const { Router } = express;
const { isAuthenticated,restrictTo } = require("../../middlewares/auth");

const { createAnnouncement, getLatestAnnouncement, getAllAnnouncements } = require("../../controllers/announment");

const router = Router();

// route POST api/admin/newAnnouncement
// desc  to create the Admin Announcement 
// access private
router.post("/newAnnouncement", isAuthenticated,restrictTo('super-admin', 'admin'), createAnnouncement);

// route GET api/latest-announcement
// desc  to get the latest Admin announcement
// access private
router.get("/latest-announcement", isAuthenticated, getLatestAnnouncement);

// route GET api/all-announcements
// desc  to get all the Admin announcement
// access private
router.get("/all-announcements", isAuthenticated,restrictTo('super-admin', 'admin'), getAllAnnouncements);

// route PUT api/user/adminHistory
// desc get admin History
// access private
// router.put("/app-status", isAuthenticated,restrictTo('super-admin', 'admin'), updateMaintenanceStatus);

module.exports = router;