
const nodemailer = require("nodemailer");
const logger = require("../utils/logger"); // Assuming a logger utility is available

const sendEmail = async (options) => {
  try {
    // Validate email input
    if (!options.email || !options.subject || !options.message) {
      throw new Error("Missing email, subject, or message content");
    }
 
    let transporter;

    // Use Postmark in both development and production (since it's a paid service)
    transporter = nodemailer.createTransport({
      host: "smtp.postmarkapp.com", // Postmark SMTP server
      port: 587, // You can use 25, 2525, or 587 as per your setup
      secure: false, // false for TLS
      auth: {
        user: process.env.POSTMARK_USERNAME, // Postmark Server Token
        pass: process.env.POSTMARK_PASSWORD, // Postmark Password (same as Username in SMTP auth)
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "PRODUCTION", // Reject unauthorized certs in production
      },
    });

    // Define email message details
    const message = {
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: options.email, // recipient's email
      subject: options.subject, // subject of the email
      text: options.message, // plain text body
      headers: {
        "X-PM-Message-Stream": "outbound", // Specify Postmark stream header
      },
    };

    // Send the email
    const info = await transporter.sendMail(message);

    // Log success
    logger.info(`Email sent to ${options.email}`, {
      messageId: info.messageId,
      response: info.response,
      timestamp: new Date().toISOString(),
    });

    return info;
  } catch (error) {
    // Enhanced error logging
    logger.error(`Failed to send email to ${options.email}`, {
      error: error.message,
      stack: error.stack,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
