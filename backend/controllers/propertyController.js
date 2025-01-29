const Property = require("../models/propertySchema");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");
const uploadPropertyImages = require("../middleware/uploadPropertyImages");


// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Public
exports.getProperties = asyncHandler(async (req, res, next) => {
  const properties = await Property.find().populate("owner", "name email");

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Get a single property by ID
// @route   GET /api/v1/properties/:id
// @access  Public
exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id)
    .populate("owner", "name email")
    .populate("reviews bookings payments");

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Create a new property
// @route   POST /api/v1/properties
// @access  Private (Owner only)

// exports.createProperty = asyncHandler(async (req, res, next) => {
//   req.body.owner = req.user.id; // Set the owner to the logged-in user

//   const property = await Property.create(req.body);

//   res.status(201).json({
//     success: true,
//     data: property,
//   });
// });

exports.createProperty = [
  // Middleware to upload images
  uploadPropertyImages,
  asyncHandler(async (req, res, next) => {
    // Extract uploaded file URLs from req.files
    const images = req.files.map((file) => file.path); // Array of image URLs from Cloudinary

    // Add images and owner to request body
    req.body.images = images;
    req.body.owner = req.user.id; // Set the owner to the logged-in user

    // Create the property
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  }),
];


// @desc    Update a property
// @route   PUT /api/v1/properties/:id
// @access  Private (Owner only)
exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure the logged-in user is the owner
  if (property.owner.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to update this property`, 403)
    );
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Delete a property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Owner only)
exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Ensure the logged-in user is the owner
  if (property.owner.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to delete this property`, 403)
    );
  }

  await property.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
