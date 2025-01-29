const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      default: ["user"],
      enum: ["admin", "manager", "supervisor", "user"],
    },
    phoneNumber: { type: String, required: true },
    profileImage: { type: String }, // URL to profile image
    isActive: { type: Boolean, default: true },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "StripePayment" }],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);
 
// Password Encryption with bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
 
  this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  next();
});

// Password Comparison Method (for login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token Generation (for authentication)
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME, // Set expiration period for the JWT
  });
};

// Generate and Hash Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and set it to the resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // Return unhashed token (this will be sent to user's email)
  return resetToken;
};

// Method to reset the password if reset token is valid
userSchema.statics.resetPasswordByToken = async function (resetToken, newPassword) {
  // Hash the reset token
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Find user by hashed token and check if token is not expired
  const user = await this.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  // Update password and clear reset token fields
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save the updated user document
  await user.save();

  return user;
};



module.exports = mongoose.model("User", userSchema);
