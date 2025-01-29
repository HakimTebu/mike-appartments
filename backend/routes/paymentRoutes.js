const express = require("express");
const {
  getPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
} = require("../controllers/stripePaymentController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply `protect` middleware to all routes to ensure only authenticated users can access
router.use(protect);

// @route   GET /api/v1/payments
// @desc    Get all payments for a user
// @access  Private (User only)
router.get("/", authorize("user"), getPayments);

// @route   GET /api/v1/payments/:id
// @desc    Get a single payment by ID
// @access  Private (User only)
router.get("/:id", authorize("user"), getPayment);

// @route   POST /api/v1/payments
// @desc    Create a new payment
// @access  Private (User only)
router.post("/", authorize("user"), createPayment);

// @route   PUT /api/v1/payments/:id
// @desc    Update payment status
// @access  Private (Admin only)
router.put("/:id", authorize("admin"), updatePaymentStatus);

module.exports = router;
