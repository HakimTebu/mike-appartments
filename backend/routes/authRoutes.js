const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { uploadImage } = require("../services/fileUploadService");

// Public Routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user
router.post("/forgot-password", forgotPassword);
// Private Routes (require authentication)
router.get("/logout", protect, logoutUser); // Logout user

router.put("/reset-password/:resetToken", resetPassword); // Reset password using token

// Private Routes (require authentication) 
router.get("/me", protect, authorize("admin"), getMe); // Get current user details
router.put("/update", protect, authorize("admin"), updateUser); // Update user details
router.put("/update-password", protect, authorize("admin"), updatePassword); // Update user password

module.exports = router;
     