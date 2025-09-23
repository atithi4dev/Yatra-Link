import express from "express";
import {
  //  registerClient,
  loginClient,
  registerClient,
} from "../controllers/clientController.js";
import {
  getBusDetails,
  nearbyBuses,
  upcomingBuses,
} from "../controllers/filterBuses.js";
import { sendOtp, verifyOTP } from "../middlewares/mailVerification.js";

const router = express.Router();

// Public routes
router.post("/register", registerClient);
router.post("/login", loginClient);
router.post("/send", sendOtp);
router.post("/verify", verifyOTP);
router.post("/", nearbyBuses);
router.post("/upcoming", upcomingBuses);
router.post("/:busId", getBusDetails);

// to add in the future roleCheck(["Client"]), when showing payment, profile, booking , profile , reviews

export default router;
