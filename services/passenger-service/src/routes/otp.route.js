import express from "express"
const router = express.Router();

import {sendOtpController, verifyOtpController} from '../controllers/otp.controller'

app.post("/send", sendOtpController);
app.post("/verify", verifyOtpController);

export default router;