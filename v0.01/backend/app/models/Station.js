import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    stationCode: { type: String, required: true, unique: true }, // e.g. "LKO"
    name: { type: String, required: true }, // e.g. "Alambagh Bus Stand"
    city: { type: String, required: true }, // Lucknow
    state: { type: String, required: true }, // Uttar Pradesh

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    facilities: {
      waitingArea: { type: Boolean, default: true },
      restrooms: { type: Boolean, default: true },
      foodCourt: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
    },

    buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
  },
  { timestamps: true }
);

stationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", stationSchema);
