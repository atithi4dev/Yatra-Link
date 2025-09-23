import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String },
    digilockerId: { type: String, required: true, unique: true },
    licenseNumber: { type: String },
    verified: { type: Boolean, default: false },
    role: { type: String, default: "Driver" },
  },
  { timestamps: true }
);

export default mongoose.model("Driver", driverSchema);
