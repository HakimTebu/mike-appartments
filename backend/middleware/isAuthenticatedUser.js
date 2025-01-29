const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./asyncHandler");

// Checks if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource.", 401));
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      console.error("User not found with the decoded ID");
      return next(new ErrorHandler("User not found.", 404));
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return next(new ErrorHandler("Invalid token. Please log in again.", 401));
  }
});
