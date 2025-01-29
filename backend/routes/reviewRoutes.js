const express = require("express");
const {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true }); // Merge params to access propertyId from parent routes

// Apply `protect` middleware to all routes to ensure only authenticated users can access
router.use(protect);

// @route   GET /api/v1/properties/:propertyId/reviews
// @desc    Get all reviews for a property
// @access  Public
router.get("/getReviews", getReviews);

// @route   POST /api/v1/properties/:propertyId/reviews
// @desc    Add a review for a property
// @access  Private (Users only)
router.post("/addReview", authorize("user"), addReview);

// @route   PUT /api/v1/reviews/:id
// @desc    Update a review
// @access  Private (Review owner only)
router.put("/editReview/:id", authorize("user"), updateReview);

// @route   DELETE /api/v1/reviews/:id
// @desc    Delete a review
// @access  Private (Review owner only)
router.delete("/deleteReview/:id", authorize("user"), deleteReview);

module.exports = router;
  