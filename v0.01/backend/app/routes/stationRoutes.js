import express from "express";
import {
  addStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation,
} from "../controllers/stationConttroller.js";
import { protect, roleCheck } from "../middlewares/authMiddleware.js";
import { csvHandle, upload } from "../func/csvRead.js";

const router = express.Router();

// Admin-protected
router.post("/", protect, roleCheck(["Station"]), addStation);
router.get("/", getStations);
router.post(
  "/upload",
  protect,
  roleCheck(["Station"]),
  upload.single("file"),
  csvHandle,
);
router.get("/:id", getStationById);
router.put("/:id", protect, roleCheck(["Station"]), updateStation);
router.delete("/:id", protect, roleCheck(["Station"]), deleteStation);

export default router;
