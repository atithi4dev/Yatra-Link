import express from "express"
const router = express.Router();
import {nearbyBuses, upcomingBuses, getBusDetails} from "../controllers/bus.controller"

router.post("/nearby-buses", nearbyBuses);
router.post("/upcoming-buses", upcomingBuses);
router.post("/bus/:busId", getBusDetails);


export default router;