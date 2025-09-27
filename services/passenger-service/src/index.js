import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import redisClient from "./config/redis.js";
import mqttClient from "./config/mqtt.js";

import { validateUserController } from "./controllers/validateUser.controller.js";

dotenv.config();

const app = express();
app.use(express.json());

// --- Connect MongoDB ---
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected for Passenger Service"))
  .catch((err) => console.error("MongoDB connection error:", err));

// IMPORT ROUTER
  import busRouter from './routes/bus.route.js'
  import otpRouter from './routes/otp.route.js'

// USE ROUTER 
app.use("/bus", busRouter);

app.use("/otp", otpRouter);

// User validation (called by gateway after login)
app.post("/validate-user", validateUserController);

// --- Start server ---
const PORT = process.env.PORT || 5008;
app.listen(PORT, () => console.log(`Passenger service running on port ${PORT}`));
