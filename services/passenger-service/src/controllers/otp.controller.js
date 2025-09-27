import crypto from "crypto";
import redis from "../config/redis.js";
import transporter from "../config/nodemailer.js";
import Passenger from "../model/passenger.model.js";

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = crypto.randomInt(100000, 999999).toString();
    await redis.setEx(`otp:${email}`, 90, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Yatra-Link OTP for Verification",
      text: `Your OTP is ${otp}. It will expire in 90 seconds.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[OTP ${otp} sent to ${email}]`);

    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) return res.status(400).json({ message: "OTP expired or not found" });

    if (storedOtp === otp) {
      await redis.del(`otp:${email}`);
      await Passenger.updateOne({ email }, { $set: { isVerified: true } });
      return res.json({ message: "OTP verified successfully" });
    }

    res.status(400).json({ message: "Invalid OTP" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
