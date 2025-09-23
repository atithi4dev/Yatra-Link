import { publishToClient } from "../mqtt/btf.js";
import { redis } from "../index.js";
import Bus from "../models/Bus.js";

export const nearbyBuses = async (req, res) => {
  try {
    const { clientId, currentPos } = res.body;

    //  sending only those buses with current pos near 8km
    const nearbyBuses = await redis.geoSearch("buses", {
      longitude: currentPos.lng,
      latitude: currentPos.lat,
      radius: 8,
      unit: "km",
    });

    publishToClient(clientId, nearbyBuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upcomingBuses = async (req, res) => {
  try {
    const { clientId, filter, currentPos } = res.body;

    //  sending only those buses with current pos near 5km
    const nearbyBuses = await redis.geoSearch("buses", {
      longitude: currentPos.lng,
      latitude: currentPos.lat,
      radius: filter,
      unit: "km",
    });

    publishToClient(clientId, nearbyBuses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBusDetails = async (req, res) => {
  try {
    const { clientId } = req.body;
    const { busId } = req.params;
    const busKey = `bus:${busId}`;

    // Check if details already exist in the hash
    const exists = await redis.hExists(busKey, "busDetails");

    let busDetails;

    if (!exists) {
      console.log(`Cache miss for bus ${busId}, fetching from Mongo...`);

      const bus = await Bus.findOne({ registrationNumber: busId })
        .select("-_id") // exculeding id
        .lean();
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }

      busDetails = bus.toObject();

      await redis.hset(busKey, { busDetails: JSON.stringify(busDetails) });

      console.log(`Bus details cached for ${busId}`);
    } else {
      console.log(`Cache hit for ${busId}`);
      const details = await redis.hGet(busKey, "busDetails");
      busDetails = JSON.parse(details);
    }

    // send to client directly + publish if needed
    publishToClient(clientId, busDetails);
  } catch (error) {
    console.error("Error in getBusDetails:", error);
    res.status(500).json({ message: error.message });
  }
};
