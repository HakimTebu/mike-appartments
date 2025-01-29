const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json() // Log messages as JSON for structured logging
  ),
  transports: [
    new transports.Console(), // Output logs to console
    new transports.File({ filename: "logs/seeder.log" }), // Save logs to a file
  ],
});

module.exports = logger;
