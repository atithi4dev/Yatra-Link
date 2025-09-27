// config/nodemailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password or email password
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer error:", error);
  } else {
    console.log("Nodemailer ready to send emails");
  }
});

export default transporter;
