const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorresponse.js");
const asyncHandler = require("./asyncHandler");

// // Protect routes for authenticated users
// exports.protect = asyncHandler(async (req, res, next) => {
//   let token;

//   // Get token from headers or cookies
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   } else if (req.cookies.token) {
//     token = req.cookies.token;
//   }

//   // Check if token exists
//   if (!token) {
//     return next(new ErrorResponse("Not authorized to access this route", 401));
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find user by ID attached to the token
//     req.user = await User.findById(decoded.id);

//     // If no user is found, return an error
//     if (!req.user) {
//       return next(new ErrorResponse("User not found with this token", 404));
//     }

//     next(); // Continue if authenticated
//   } catch (error) {
//     return next(new ErrorResponse("Not authorized to access this route", 401));
//   }
// });

// // Role-based access control
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     // Ensure req.user exists and has a role
//     if (!req.user || !req.user.role) {
//       return next(new ErrorResponse("No role assigned to this user", 403));
//     }

//     // Check if the user's role is allowed
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorResponse(`Role (${req.user.role}) not authorized`, 403)
//       );
//     }

//     next(); // Continue if authorized
//   };
// };





// Protect routes for authenticated users
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse("User not found with this token", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return next(new ErrorResponse("No roles assigned to this user", 403));
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return next(
        new ErrorResponse(`Role (${req.user.roles}) not authorized`, 403)
      );
    }

    next();
  };
};
