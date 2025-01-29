const express = require("express");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Apply the `protect` middleware to ensure only authenticated users can access the routes
router.use(protect);

// @route   GET /api/v1/notifications
// @desc    Get all notifications for the logged-in user
// @access  Private
router.get("/", getNotifications);

// @route   PUT /api/v1/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put("/:id/read", markAsRead);

// @route   DELETE /api/v1/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete("/:id", deleteNotification);

module.exports = router;
