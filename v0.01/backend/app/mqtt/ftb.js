import mqtt from "mqtt";
import { handleDriverPayload } from "./payloadHandler.js";

// WebSocket broker for browser
const brokerUrl = "ws://localhost:9001";
// const mqttClient = mqtt.connect(brokerUrl, {
//   reconnectPeriod: 5000,
//   keepalive: 10,
// });

export function startMQTT(driverId) {
  // Create a separate client for each driver
  const mqttClient = mqtt.connect(brokerUrl, {
    reconnectPeriod: 5000,
    keepalive: 10,
  });

  console.log(`DRIVER LOGGED IN ${driverId}`);

  mqttClient.on("connect", () => {
    console.log(`MQTT connected for driver ${driverId}`);

    // Subscribe after connection is established
    mqttClient.subscribe(`drivers/${driverId}/location`, { qos: 1 }, (err) => {
      if (err) console.error("Subscribe error:", err);
      else console.log(`Subscribed to drivers/${driverId}/location`);
    });
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());

      // This will now run for every message
      console.log(`[MQTT] Received from ${topic}:`, payload);

      await handleDriverPayload(payload);
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  mqttClient.on("error", (err) => console.error("MQTT Error:", err));
  mqttClient.on("offline", () => console.log("MQTT offline"));
  mqttClient.on("reconnect", () => console.log("MQTT reconnecting..."));

  return mqttClient; 
}