const express = require("express");
const router = express.Router();
const adminAccess = require("../middlewares/adminAccess")
const verifyAccessToken = require("../middlewares/verifyAccessToken")
const {
  register,
  login,
  logout,
  getProfile,
  refreshAccessTokenController,
  changePasswordController,
  updateProfile
} = require("../controllers/auth.controller");



// @route   POST /api/v1/users/register
router.post("/register", register);

// @route   POST /api/v1/users/login
router.post("/login", login);

// @route   POST /api/v1/users/logout
router.post("/logout", verifyAccessToken, logout);

// @route   POST /api/v1/users/change-password
router.put('/change-password', verifyAccessToken, changePasswordController);

// @route   GET /api/v1/users/profile
router.get('/profile', verifyAccessToken, getProfile);

// @route   POST /api/v1/users/update-profile
router.put('/update-profile', verifyAccessToken, updateProfile);

// @route POST /api/v1/users/refresh-Token
router.post("/refresh-token", refreshAccessTokenController);


// @testing -- dashboard

router.get('/dashboard', verifyAccessToken, adminAccess, (req, res) => {
  res.send("Dashboard")
});


module.exports = router;
