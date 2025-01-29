
const upload = require("../middleware/upload.js");
const User = require("../models/user.js"); // Import the User model
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");
const sendToken = require("../utils/jwtToken.js");


// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public

exports.registerUser = [
  upload.single("profileImage"), // Multer middleware to handle image upload
  asyncHandler(async (req, res, next) => {
    try {
      const { username, email, password, phoneNumber } = req.body;

      // Check if a file was uploaded
      let profileImageUrl = null;
      if (req.file && req.file.path) {
        profileImageUrl = req.file.path; // Cloudinary provides the URL in `file.path`
      }

      console.log("Uploaded file details:", req.file);

      // Create a new user with the uploaded image URL
      const user = await User.create({
        username,
        email,
        password,
        phoneNumber,
        profileImage: profileImageUrl,
      });

      // Send a success response with the user details and token
      sendToken(user, 201, res, {
        message: "You have successfully registered",
      });
    } catch (error) {
      // Handle errors (e.g., validation, database errors)
      console.error("Error during registration:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again later.",
      });
    }
  }),
];



// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Send token response
  sendToken(user, 200, res, {
    message: "You have successfully Logged in",
  });
});

// @desc    Get current logged-in user details
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/update
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "You have successfully Updated the profile",
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new ErrorResponse("Current password is incorrect", 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Send token response
  sendToken(user, 200, res, {
    message: "You have successfully updated the password",
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse("User not found with this email", 404));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Send resetToken to the user's email (dummy example here)
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset-password/${resetToken}`;

  res.status(200).json({
    success: true,
    message: `Password reset link sent to email: ${resetUrl}`,
  });
});


exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password: newPassword } = req.body;

  try {
    // Call the model's resetPasswordByToken method
    const user = await User.resetPasswordByToken(resetToken, newPassword);

    // Send token response upon successful reset
    sendToken(user, 200, res, {
      message: "You have successfully reset the password",
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});    


// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  // Clear the JWT token by setting it to null
  res.status(200).json({
    message: "Logged out Successfully",
    success: true,
  });
});


