const Notification = require("../models/notificationSchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all notifications for a user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(
        `Notification not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Ensure the notification belongs to the requesting user
  if (notification.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to access this notification`, 403)
    );
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
  });
});

// @desc    Delete a notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(
        `Notification not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Ensure the notification belongs to the requesting user
  if (notification.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this notification`, 403)
    );
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
