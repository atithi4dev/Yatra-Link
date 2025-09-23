import express from "express";
import {
  registerDriver,
  loginDriver,
  handleDriver,
} from "../controllers/driverController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.post("/", protect, roleCheck(["Driver"]), handleDriver); // startMQTT

export default router;
