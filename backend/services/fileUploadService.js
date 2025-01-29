const cloudinary = require("../config/cloudinaryConfig");

const uploadImage = async (filePath, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result;
  } catch (error) {
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

module.exports = { uploadImage };
