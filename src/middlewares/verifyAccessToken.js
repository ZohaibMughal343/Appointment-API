const jwt = require("jsonwebtoken");
const ApiError = require("../utilis/ApiError");
const verifyAccessToken = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) return next(new ApiError(401, "Please Login!"));

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // Pass the error to API Error bcz use only 1 route
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

module.exports = verifyAccessToken;
