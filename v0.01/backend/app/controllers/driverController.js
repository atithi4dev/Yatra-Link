import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";
import { startMQTT } from "../mqtt/ftb.js";

// 🔑 Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new driver (with DigiLocker verification)
// @route   POST /api/drivers/register
// @access  Public
export const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, digilockerId, licenseNumber } = req.body;

    if (!name || !digilockerId) {
      return res
        .status(400)
        .json({ message: "Name and DigiLocker ID are required" });
    }

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ digilockerId });
    if (existingDriver) {
      return res
        .status(400)
        .json({ message: "Driver with this DigiLocker ID already exists" });
    }

    // DigiLocker verification flow (stub)
    // Here you would call DigiLocker APIs to verify driver credentials.
    // For now, we just mark as verified = true.
    const verified = true;

    const driver = await Driver.create({
      name,
      email,
      phone,
      digilockerId,
      licenseNumber,
      verified,
    });

    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      digilockerId: driver.digilockerId,
      licenseNumber: driver.licenseNumber,
      verified: driver.verified,
      role: driver.role,
      token: generateToken(driver._id, driver.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login driver
// @route   POST /api/drivers/login
// @access  Public
export const loginDriver = async (req, res) => {
  try {
    const { digilockerId } = req.body;

    if (!digilockerId) {
      return res
        .status(400)
        .json({ message: "DigiLocker ID is required to proceed" });
    }

    const driver = await Driver.findOne({ digilockerId });
    if (!driver) {
      return res.status(401).json({ message: "Invalid DigiLocker ID" });
    }

    if (!driver.verified) {
      return res.status(403).json({ message: "Driver not verified" });
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      digilockerId: driver.digilockerId,
      licenseNumber: driver.licenseNumber,
      verified: driver.verified,
      role: driver.role,
      // token: generateToken(driver._id, driver.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleDriver = async (req, res) => {
  const { driverId, status } = req.body;
  if (!status === "READY") {
    return res.status(201).json({ message: "Driver status not ready" });
  }
  // starting the mqtt for publishing to the broker;
  startMQTT(driverId);
};
