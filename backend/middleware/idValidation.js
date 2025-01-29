const mongoose = require("mongoose");
const isValidObjectId = mongoose.Types.ObjectId.isValid;

// Middleware to validate IDs
const validateObjectId = (id, fieldName) => {
  if (!isValidObjectId(id)) {
    throw new ErrorResponse(`${fieldName} is not a valid ID`, 400);
  }
};
