import { generateToken } from "../middlewares/authMiddleware.js";
import Client from "../models/Client.js";

// @desc    Register a new client
// @route   POST /api/clients/register
// @access  Public

export const registerClient = async (req, res) => {
  try {
    const { userName, phone, email, password } = req.body;

    if (!userName || !phone || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, phone and password are required" });
    }

    // Check if client already exists
    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: "Client already exists" });
    }

    // Create client
    const client = await Client.create({
      userName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      _id: client._id,
      userName: client.userName,
      email: client.email,
      phone: client.phone,
      role: client.role,
      token: generateToken(client._id, client.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login client
// @route   POST /api/clients/login
// @access  Public
export const loginClient = async (req, res) => {
  try {
    const { userName, phone, email, password } = req.body;

    // Check client exists
    const client = await Client.findOne({ email });
    if (!client || !(await client.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!userName || !phone || !email) {
      return res
        .status(400)
        .json({ message: "Name, email phone are required" });
    }

    return res.status(201).json({
      userName,
      email,
      phone,
      role: "Client",
      token: generateToken(client._id, client.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
