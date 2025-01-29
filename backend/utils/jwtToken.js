
const sendToken = (user, statusCode, res) => {
  // Create JWT token using the user's method
  const token = user.getSignedJwtToken();

  // Calculate the expiration time for the cookie in milliseconds
  const expiresInDays = Number(process.env.COOKIE_EXPIRES_TIME);
  if (isNaN(expiresInDays) || expiresInDays <= 0) {
    throw new Error(
      "Invalid COOKIE_EXPIRES_TIME. Ensure it is set to a positive number."
    );
  }

  const expiresInMs = expiresInDays * 24 * 60 * 60 * 1000;

  // Define cookie options
  const options = {
    expires: new Date(Date.now() + expiresInMs), // Expiration time in ms
    httpOnly: true, // Ensures the cookie is only accessible via the web server, reducing XSS attacks
    secure: process.env.NODE_ENV === "PRODUCTION", // Secure cookie for production (sent over HTTPS only)
    sameSite: process.env.NODE_ENV === "PRODUCTION" ? "Strict" : "Lax", // SameSite attribute for CSRF protection
  };

  // Send the token as a cookie and respond with success status
  res
    .status(statusCode)
    .cookie("token", token, options) // Set token in cookie
    .json({
      success: true,
      token, // Send token in response body
      user, // Send user data in response
    });
};

module.exports = sendToken;
