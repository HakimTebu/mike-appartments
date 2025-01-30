const AdminLog = require("../models/adminLogSchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all admin logs
// @route   GET /api/admin-logs
// @access  Admin only
exports.getAdminLogs = asyncHandler(async (req, res, next) => {
  const logs = await AdminLog.find().populate("admin", "name email role");
  res.status(200).json({
    success: true,
    count: logs.length,
    data: logs,
  });
}); 

// @desc    Get a single admin log by ID
// @route   GET /api/admin-logs/:id
// @access  Admin only
exports.getAdminLog = asyncHandler(async (req, res, next) => {
  const log = await AdminLog.findById(req.params.id).populate(
    "admin",
    "name email role"
  );

  if (!log) {
    return next(new ErrorResponse("Admin log not found", 404));
  }

  res.status(200).json({
    success: true, 
    data: log,
  });
}); 

// @desc    Create a new admin log
// @route   POST /api/admin-logs
// @access  Admin only
exports.createAdminLog = asyncHandler(async (req, res, next) => {
  const { admin, action, details } = req.body;

  const log = await AdminLog.create({
    admin,
    action,
    details,
  });

  res.status(201).json({
    success: true,
    data: log,
  });
});

// @desc    Update an admin log
// @route   PUT /api/admin-logs/:id
// @access  Admin only
exports.updateAdminLog = asyncHandler(async (req, res, next) => {
  let log = await AdminLog.findById(req.params.id);

  if (!log) {
    return next(new ErrorResponse("Admin log not found", 404));
  }

  log = await AdminLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: log,
  });
});

// @desc    Delete an admin log
// @route   DELETE /api/admin-logs/:id
// @access  Admin only thats it
exports.deleteAdminLog = asyncHandler(async (req, res, next) => {
  const log = await AdminLog.findById(req.params.id);

  if (!log) {
    return next(new ErrorResponse("Admin log not found", 404));
  }
 
  await log.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
 