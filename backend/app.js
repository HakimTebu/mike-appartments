// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middleware/errors");

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser());

// Import routes (do not pass io here; pass it in server.js)
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminLogRoutes = require("./routes/adminLogRoutes");

// Use routes (without Socket.IO instance)
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/properties", propertyRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin-logs", adminLogRoutes);



// Middleware to handle errors 
app.use(errorMiddleware);

// Export Express app
module.exports = app;
