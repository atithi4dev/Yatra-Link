// auth-service/index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

// --- DB Connection ---
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected for Auth Service"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Import Router
import passengerRouter from "./routes/passenger.routes"


// Use router
app.post("/passenger", passengerRouter);

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
