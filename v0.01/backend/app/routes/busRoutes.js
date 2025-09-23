import express from "express";
import {
  addBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus,
  getBusByRegistrationNo,
} from "../controllers/busController.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin-protected
router.post("/", protect, roleCheck(["Admin"]), addBus);
router.get("/", getBuses);
router.get("/:id", getBusById);
router.get("/:regNo", getBusByRegistrationNo);
router.put("/:id", protect, roleCheck(["Admin"]), updateBus);
router.delete("/:id", protect, roleCheck(["Admin"]), deleteBus);

export default router;
