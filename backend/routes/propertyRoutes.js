const express = require("express");
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Apply `protect` middleware to all routes to ensure only authenticated users can access
router.use(protect);

// @route   GET /api/v1/properties
// @desc    Get all properties
// @access  Public
router.get("/getAll", getProperties);

// @route   GET /api/v1/properties/:id
// @desc    Get a single property by ID
// @access  Public
router.get("/getProperty/:id", getProperty);

// @route   POST /api/v1/properties
// @desc    Create a new property
// @access  Private (Owner only)
router.post("/create", authorize("owner"), createProperty);

// @route   PUT /api/v1/properties/:id
// @desc    Update a property
// @access  Private (Owner only)
router.put("/edit/:id", authorize("owner"), updateProperty);

// @route   DELETE /api/v1/properties/:id
// @desc    Delete a property
// @access  Private (Owner only)
router.delete("/delete/:id", authorize("owner"), deleteProperty);

module.exports = router;
