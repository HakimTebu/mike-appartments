const Interaction = require("../models/interaction.js");
const Product = require("../models/product.js");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Calculate trending products based on interactions in the last week
// @route   GET /api/products/trending
// @access  Public
exports.calculateTrendingProducts = asyncHandler(async (req, res, next) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Fetch interactions and aggregate trending products
  const interactions = await Interaction.aggregate([
    { $match: { timestamp: { $gte: oneWeekAgo } } },
    { $group: { _id: "$productId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  if (!interactions.length) {
    return next(new ErrorResponse("No trending products found.", 404));
  }

  // Fetch product details for the trending products
  const trendingProducts = await Product.find({
    _id: { $in: interactions.map((i) => i._id) },
  });

  res.status(200).json({
    success: true,
    count: trendingProducts.length,
    data: trendingProducts,
  });
});
