// Handling user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role (${req.user.role}) is not authorized to access this resource.`,
          403
        )
      );
    }
    next();
  };
};

