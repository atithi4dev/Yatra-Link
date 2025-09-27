import Passenger from "../model/passenger.model.js";
import jwt from "jsonwebtoken";

export const validateUserController = async (req, res) => {
  try {
    const { username } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
    const passenger = await Passenger.findOne({ _id: decoded.id });

    if (!passenger) return res.status(404).json({ message: "User not found" });

    res.json({ userName: passenger.userName, email: passenger.email, phone: passenger.phone, role: passenger.role });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};
