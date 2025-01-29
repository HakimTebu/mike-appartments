
const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const products = require("../data/products");
const logger = require("../utils/logger"); // Assuming logger is a utility for structured logging

// Load environment variables
dotenv.config({ path: "backend/config/config.env" });

// Connect to the database
connectDatabase();

const seedProducts = async () => {
  try {
    // Ensure that this script doesn't run in production
    if (process.env.NODE_ENV === "PRODUCTION") {
      throw new Error("Seeding is not allowed in production. Exiting...");
    }

    logger.info("Starting product seeding...");

    // Clear existing products
    await Product.deleteMany();
    logger.info("All existing products have been deleted");

    // Insert new products
    await Product.insertMany(products);
    logger.info(`${products.length} products have been successfully added`);

    logger.info("Seeding process completed successfully");
    process.exit(0); // Graceful exit on success
  } catch (error) {
    // Log error details for debugging
    logger.error(`Seeding failed: ${error.message}`, {
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    process.exit(1); // Graceful exit on failure
  }
};

// Execute the seeding function
seedProducts();
