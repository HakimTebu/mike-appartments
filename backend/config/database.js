
const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI) // Removed deprecated options
    .then((con) => {
      console.log(`MONGO DB CONNECTED WITH THE HOST: ${con.connection.host}`);
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      process.exit(1); // Optional: exit the process if connection fails
    });
};

module.exports = connectDatabase;
