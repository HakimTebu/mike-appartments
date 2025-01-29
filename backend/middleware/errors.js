

const ErrorResponse = require("../utils/errorresponse.js");

// Global error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // Development: Log stack trace and detailed error info
    console.error(err);
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err, message: err.message };

    // Handling specific errors

    // Mongoose Invalid ObjectId Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorResponse(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new ErrorResponse(message, 400);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue);
      const message = `Duplicate field value entered for ${field}. Please use another value.`;
      error = new ErrorResponse(message, 400);
    }

    // JWT Error
    if (err.name === "JsonWebTokenError") {
      const message = "Invalid JSON Web Token. Please log in again.";
      error = new ErrorResponse(message, 400);
    }

    // JWT Expired Error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token has expired. Please log in again.";
      error = new ErrorResponse(message, 400);
    }

    // Temporary debugging information in production
    console.error("Production Error:", err); 

    // Send response in production mode
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
      // Uncomment below temporarily to debug validation errors in production
      // errorDetails: err.errors || null
    });
  }
};
