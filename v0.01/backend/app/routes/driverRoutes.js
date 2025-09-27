import express from "express";
import {
  registerDriver,
  loginDriver,
  handleDriver,
} from "../controllers/driverController.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.post("/",  handleDriver); // startMQTT  protect, roleCheck(["Driver"]),

export default router;
