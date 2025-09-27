import fetch from "node-fetch";
import redis from "../config/redis.js";

const DRIVER_SERVICE = process.env.DRIVER_SERVICE_URL || "http://driver-service:500X";
const MQTT_SERVICE = process.env.MQTT_SERVICE_URL || "http://mqtt-handler-service:500Y";

// Nearby buses
export const nearbyBuses = async (req, res) => {
  try {
    const { clientId, currentPos } = req.body;

    // Ask driver-service for nearby buses
    const resp = await fetch(`${DRIVER_SERVICE}/buses/nearby`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPos }),
    });
    const buses = await resp.json();

    // Send to client via mqtt-handler-service
    await fetch(`${MQTT_SERVICE}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, data: buses }),
    });

    res.json({ message: "Nearby buses sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Upcoming buses
export const upcomingBuses = async (req, res) => {
  try {
    const { clientId, currentPos, filter } = req.body;

    const resp = await fetch(`${DRIVER_SERVICE}/buses/upcoming`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPos, filter }),
    });
    const buses = await resp.json();

    await fetch(`${MQTT_SERVICE}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, data: buses }),
    });

    res.json({ message: "Upcoming buses sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Bus details
export const getBusDetails = async (req, res) => {
  try {
    const { clientId } = req.body;
    const { busId } = req.params;

    const resp = await fetch(`${DRIVER_SERVICE}/buses/${busId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const busDetails = await resp.json();

    await fetch(`${MQTT_SERVICE}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, data: busDetails }),
    });

    res.json({ message: "Bus details sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
