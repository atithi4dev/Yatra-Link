import jwt from "jsonwebtoken";
import Client from "../models/Client.js";
import Driver from "../models/Driver.js";
import Station from "../models/Station.js";

const models = {
  Station,
  Driver,
  Client,
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const Model = models[decoded.role]; // Pick correct model
      if (!Model) {
        return res.status(401).json({ message: "Invalid role" });
      }

      req.user = await Model.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Wrong role" });
    }
    next();
  };
};

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // payload
    process.env.JWT_SECRET, // secret key
    { expiresIn: "10d" }, // token expiration
  );
};
