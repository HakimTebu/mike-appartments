const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "StripePayment" }],
    images: [{ type: String, required: true }], // Array of image URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
 