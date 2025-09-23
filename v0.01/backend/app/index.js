import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import clientRoutes from "./routes/clientRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import Redis from "ioredis";

dotenv.config();

const app = express();
app.use(express.json());

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// reids connection
export const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

redis.on("connect", () => {
  console.log("Connected to Redis at ");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/stations", stationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
