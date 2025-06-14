const { registerUser, loginUser, logoutUser, changePassword, getUserProfile, updateUserProfile, refreshAccessTokenService } = require("../services/auth.service");
const { validatePasswordFields } = require("../validations/passwordValidators");
const ApiResponse = require("../utilis/ApiResponse");
const ApiError = require("../utilis/ApiError");



// User Register Controller

const register = async (req, res, next) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'password'];
  // console.log(allowedFields);

  try {

    const requestFields = Object.keys(req.body);


    // Find unwanted field
    const extraFields = requestFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      throw new ApiError(400, `Extra fields not allowed: ${extraFields}`);
    }

    // Send Client Data to Regiser Service

    const user = await registerUser(req.body);
    // console.log(req.body);
    // console.log(user);
    const { _id, email, firstName, lastName } = user;

    const response = new ApiResponse(201, "User Register Successfully", {
      _id, email, firstName, lastName,
    });
    res.status(response.statusCode).json(response);

  } catch (err) {
    next(err);
  }
};

// User Login Controller

const login = async (req, res, next) => {
  try {
    const allowedFields = ["email", "password"];
    const requestFields = Object.keys(req.body);
    const extraFields = requestFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      throw new ApiError(400, `Extra fields not allowed: ${extraFields}`);
    }

    const loginData = await loginUser(req.body);
    const { user, accessToken, refreshToken } = loginData;


    // remove accessToken from cookies after 15 min

    res
      .cookie("accessToken", accessToken, { maxAge: 15 * 60 * 1000 })

      // remove refreshToken from cookies after 7 days

      .cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    const response = new ApiResponse(201, "Login Successfully", {
      user,
      accessToken,
      refreshToken,
    });

    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};


// User logout Controller

const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user._id);
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
    // .json(new ApiResponse(200, "Logged out successfully"));
    const response = new ApiResponse(200, "Logged out successfully")
    res.status(response.statusCode).json({ response });
  } catch (err) {
    next(err);
  }
};


// User changePasswordController Controller

const changePasswordController = async (req, res, next) => {
  try {
    const allowedFields = ["currentPassword", "newPassword", "confirmPassword"];
    const requestFields = Object.keys(req.body);
    const extraFields = requestFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      throw new ApiError(400, `Invalid field(s): ${extraFields}`);
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    validatePasswordFields({ currentPassword, newPassword, confirmPassword });

    await changePassword(req.user._id, currentPassword, newPassword);
    res.status(200).json(new ApiResponse(200, "Password updated successfully"));
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const user = await getUserProfile(userId);
    res.status(200).json(new ApiResponse(200, "User Profile", { user }));
  } catch (err) {
    next(err)
  }
};

// User Update Profile Controller

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updatedUser = await updateUserProfile(userId, req.body);

    res.status(200).json(new ApiResponse(200, "Profile updated successfully", { updatedUser }));
  } catch (err) {
    next(err);
  }
};

// Regenerate Access Token

const refreshAccessTokenController = async (req, res, next) => {
  try {
    const { accessToken } = await refreshAccessTokenService(req.cookies?.refreshToken);
    // console.log(req.cookies)

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    const response = new ApiResponse(200, "Access token refreshed", {
      accessToken,
    });

    res.status(response.statusCode).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  getProfile,
  refreshAccessTokenController,
  changePasswordController
};


