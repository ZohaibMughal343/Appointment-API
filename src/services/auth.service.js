const ApiError = require("../utilis/ApiError");
const User = require('../models/user.model');
const sendVerificationEmail = require("../services/email.service")
const jwt = require("jsonwebtoken");
const { validateRequiredFields, validateFirstName, validateLastName, validateEmail, validatePassword } = require('../validations/authValidations');
const generateOTP = require('../utilis/generateOtp');
const { createOrGetAOneOnOneChat } = require("../controllers/chat.controller.js");
const verficationCode = generateOTP();

// User registerUser Services

const registerUser = async ({ firstName, lastName, email, password }) => {
  // Validate inputs
  validateRequiredFields([firstName, lastName, email, password]);
  validateFirstName(firstName);
  validateLastName(lastName);
  validateEmail(email);
  validatePassword(password);

  const existingEmail = await User.findOne({ email });

  // If email is taken and unverified

  if (existingEmail) {
    if (!existingEmail.isEmailVerified) {
      throw new ApiError(400, "Try later.");
    }
    throw new ApiError(400, "Email is already taken");
  }

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    verficationCode,
  });

  await newUser.save();
  await sendVerificationEmail(newUser.email, verficationCode);

  return newUser;
};

// User loginUser Services

const loginUser = async ({ email, password }) => {
  const requiredFields = [email, password];
  if (requiredFields.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Both Email and Password are required");
  }

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "Email not found");

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Email not verified. Please verify your email before logging in."
    );
  }
  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const conversationId = await createOrGetAOneOnOneChat(user._id);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.conversationId = conversationId;

  await user.save();

  return { user, accessToken, refreshToken };
};

// User logoutUser Services

const logoutUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.refreshToken = null;
  await user.save();
};

// User changePassword Services

const changePassword = async (userId, currentPassword, newPassword) => {
  validatePassword(newPassword);

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isCorrectPassword = await user.isPasswordCorrect(currentPassword);
  if (!isCorrectPassword)
    throw new ApiError(400, "Current password is incorrect");

  const isSameAsCurrent = await user.isPasswordCorrect(newPassword);
  if (isSameAsCurrent)
    throw new ApiError(
      400,
      "New password must be different from the current password"
    );

  user.password = newPassword;
  await user.save();
};

// User getUserProfile

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "firstName lastName profilePicture"
  ); // exclude password
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

// User UpdateProfile Services

const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ["firstName", "lastName", "profilePicture"];
  const filteredData = {};

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) {
      filteredData[key] = updateData[key];
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredData },
    { new: true, runValidators: true }
  ).select("firstName lastName profilePicture");

  if (!updatedUser) throw new ApiError(404, "User not found");

  return updatedUser;
};

// refresh AccessToken Services

const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (err) {
    throw new ApiError(401, err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  getUserProfile,
  updateUserProfile,
  refreshAccessTokenService,
};
