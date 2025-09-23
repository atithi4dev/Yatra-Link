import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }, // e.g. UP-32 AB 1234
    operatorName: { type: String, required: true, trim: true }, // UPSRTC, VRL, etc.
    type: {
      type: String,
      enum: [
        "AC",
        "Non-AC",
        "Sleeper",
        "Semi-Sleeper",
        "Double-Decker",
        "Electric",
      ],
      default: "Non-AC",
    },
    capacity: {
      type: Number,
      default: 50,
      min: [10, "Bus must have at least 10 seats"],
    },

    // route info if change then change the check deviation too
    route: {
      startStation: { type: String, required: true },
      endStation: {
        lat: {
          type: Number,
          required: [true, "End station latitude required"],
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          required: [true, "End station longitude required"],
          min: -180,
          max: 180,
        },
      },
      stops: [
        {
          station: {
            lat: {
              type: Number,
              required: [true, "STOP latitude required"],
              min: -90,
              max: 90,
            },
            lng: {
              type: Number,
              required: [true, "STOP longitude required"],
              min: -180,
              max: 180,
            },
          },
          arrivalTime: { type: String }, // e.g. "10:30 AM"
          departureTime: { type: String }, // e.g. "10:35 AM"
        },
      ],
    },

    // // real-time location
    // lastKnownLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
    //   updatedAt: { type: Date, default: Date.now },
    // },
    //
    // schedule info

    // timetable: [
    //   {
    //     day: { type: String }, // e.g. 2025-09-04
    //     departureTime: { type: String }, // e.g. "09:00 AM"
    //     arrivalTime: { type: String }, // e.g. "05:30 PM"
    //   },
    // ],
  },
  { timestamps: true },
);

export default mongoose.model("Bus", busSchema);
