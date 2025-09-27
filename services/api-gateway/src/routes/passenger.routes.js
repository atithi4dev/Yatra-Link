import express from 'express';
import {
  sendOTP,
  loginPassenger,
  registerPassenger,
  authenticatePassenger,
  verifyOTP,
  nearbyBusses,
  upcomingBusses,
  getBudByBusId
} from "../controllers/passenger.controller"

const router = express.Router();

router.post('/register', registerPassenger);

router.post('/login', authenticatePassenger, loginPassenger);

router.post('/send', sendOTP);

router.post('/verify',verifyOTP);

router.post('/nearby', nearbyBusses);

router.post('/upcoming',upcomingBusses);

router.post('/:busId',getBudByBusId);

export default router;