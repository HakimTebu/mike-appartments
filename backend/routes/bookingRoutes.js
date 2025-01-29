const express = require("express");
const router = express.Router();
const {
  getBookings,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingControllers");
const { protect, authorize } = require("../middleware/auth");

// Protect all routes
router.use(protect);

// Admin-only routes
router.route("/").get(authorize("admin"), getBookings);
router
  .route("/:id")
  .get(authorize("admin", "user"), getBooking)
  .put(authorize("admin"), updateBooking)
  .delete(authorize("admin"), deleteBooking);

// User-specific routes
router.route("/user/:userId").get(authorize("admin", "user"), getUserBookings);

// User can create bookings
router.route("/").post(authorize("user"), createBooking);

module.exports = router;
