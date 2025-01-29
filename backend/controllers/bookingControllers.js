const Booking = require("../models/bookingSchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Admin only
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate("user", "name email")
    .populate("property", "name location");

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get bookings for a specific user
// @route   GET /api/bookings/user/:userId
// @access  Protected (User or Admin)
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.params.userId }).populate(
    "property",
    "name location"
  );

  if (!bookings) {
    return next(new ErrorResponse("No bookings found for this user", 404));
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Protected (User or Admin)
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("property", "name location");

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Protected (User)
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { user, property, startDate, endDate, totalPrice } = req.body;

  // Validate the required fields
  if (!user || !property || !startDate || !endDate || !totalPrice) {
    return next(
      new ErrorResponse("Please provide all required booking details", 400)
    );
  }

  const booking = await Booking.create({
    user,
    property,
    startDate,
    endDate,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

// @desc    Update a booking
// @route   PUT /api/bookings/:id
// @access  Admin only
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Admin only
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse("Booking not found", 404));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
