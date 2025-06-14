const express = require("express");
const router = express.Router();

const verifyEmail  = require("../controllers/email.controller");

router.post("/verify-otp", verifyEmail);

module.exports = router;