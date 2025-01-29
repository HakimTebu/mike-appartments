

// server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // Import the Express app
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path:
    process.env.NODE_ENV === "PRODUCTION"
      ? path.join(__dirname, "config/config.prod.env")
      : path.join(__dirname, "config/config.dev.env"),
});

// Connect to the database
connectDatabase();

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Create an HTTP server using the express app
const server = http.createServer(app);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
