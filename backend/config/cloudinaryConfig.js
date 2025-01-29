const cloudinary = require("cloudinary").v2;
require("dotenv").config();


// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "dtxqmyvv2",
  api_key: 113311516399536,
  api_secret: "YCpxh6J9TxcmTHdeicrBDZtBqr8",
});

// console.log(cloudinary.config());

module.exports = cloudinary;

// Log credentials to check if they are correctly loaded
// console.log({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });  