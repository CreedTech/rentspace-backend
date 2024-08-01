const express = require("express");

const { isAuthenticated, restrictTo } = require("../../middlewares/auth");
const { createDVA, getUserDVA, getAllDVAs } = require("../../controllers/dva");
const { createUserDva } = require("../../services/createDVA");




const { Router } = express;

const router = Router();

router.post("/create-dva", createDVA);
router.post("/create-user-dva", createUserDva);
router.get("/get-dva", isAuthenticated, getUserDVA);
router.get("/get-dvas", isAuthenticated, restrictTo('super-admin', 'admin'), getAllDVAs);

module.exports = router;
