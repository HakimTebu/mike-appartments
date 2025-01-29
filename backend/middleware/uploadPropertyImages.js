const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "property_images", // Folder name in Cloudinary
      allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
    };
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Middleware for uploading multiple property images
const uploadPropertyImages = upload.array("images", 5); // Accept up to 5 files

module.exports = uploadPropertyImages;
