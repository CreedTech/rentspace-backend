const express = require("express");
const router = express.Router();
const {
  applyForLoan,
  uploadUtilityBill,
  getUserLoans,
} = require("../../controllers/loan");
const { isAuthenticated } = require("../../middlewares/auth");
const { cloudinaryConfig } = require("../../services/cloudinaryConfig");
const { upload } = require("../../middlewares/upload");

// Route for applying for a loan
router.post("/apply", isAuthenticated, applyForLoan);

router.get("/portfolio", isAuthenticated, getUserLoans);
// Route for uploading utility bill
router.post(
  "/uploadUtilityBill",
  isAuthenticated,
  upload.single("utility"),
  cloudinaryConfig,
  uploadUtilityBill
);

module.exports = router;
