const StripePayment = require("../models/stripePaymentSchema");
const Property = require("../models/propertySchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all payments for a user
// @route   GET /api/v1/payments
// @access  Private (User only)
exports.getPayments = asyncHandler(async (req, res, next) => {
  const payments = await StripePayment.find({ user: req.user.id }).populate(
    "property",
    "title price location"
  );

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  });
});

// @desc    Get a single payment by ID
// @route   GET /api/v1/payments/:id
// @access  Private (User only)
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await StripePayment.findById(req.params.id).populate(
    "property",
    "title price location"
  );

  if (!payment) {
    return next(
      new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure the logged-in user is the owner of the payment
  if (payment.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to view this payment", 403));
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// @desc    Create a new payment
// @route   POST /api/v1/payments
// @access  Private (User only)
exports.createPayment = asyncHandler(async (req, res, next) => {
  const { property, stripePaymentIntentId, amount } = req.body;

  // Check if the property exists
  const existingProperty = await Property.findById(property);
  if (!existingProperty) {
    return next(
      new ErrorResponse(`Property not found with id of ${property}`, 404)
    );
  }

  // Create a new payment record
  const payment = await StripePayment.create({
    user: req.user.id,
    property,
    stripePaymentIntentId,
    amount,
    currency: req.body.currency || "UGX",
    paymentStatus: req.body.paymentStatus || "pending",
  });

  res.status(201).json({
    success: true,
    data: payment,
  });
});

// @desc    Update payment status
// @route   PUT /api/v1/payments/:id
// @access  Private (Admin only)
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  let payment = await StripePayment.findById(req.params.id);

  if (!payment) {
    return next(
      new ErrorResponse(`Payment not found with id of ${req.params.id}`, 404)
    );
  }

  // Update the payment status
  payment.paymentStatus = req.body.paymentStatus;
  await payment.save();

  res.status(200).json({
    success: true,
    data: payment,
  });
});
