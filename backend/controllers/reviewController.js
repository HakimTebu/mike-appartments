const Review = require("../models/reviewSchema");
const Property = require("../models/propertySchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all reviews for a property
// @route   GET /api/v1/properties/:propertyId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ property: req.params.propertyId })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

// @desc    Add a review for a property
// @route   POST /api/v1/properties/:propertyId/reviews
// @access  Private (Users only)
exports.addReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const propertyId = req.params.propertyId;

  // Check if the property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${propertyId}`, 404)
    );
  }

  // Check if the user has already reviewed this property
  const existingReview = await Review.findOne({
    property: propertyId,
    user: req.user.id,
  });

  if (existingReview) {
    return next(
      new ErrorResponse("You have already reviewed this property", 400)
    );
  }

  // Create a new review
  const review = await Review.create({
    property: propertyId,
    user: req.user.id,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private (Review owner only)
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure the logged-in user is the owner of the review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to update this review", 403));
  }

  const { rating, comment } = req.body;

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { rating, comment },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (Review owner only)
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure the logged-in user is the owner of the review
  if (review.user.toString() !== req.user.id) {
    return next(new ErrorResponse("Not authorized to delete this review", 403));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
