import mqtt from "mqtt";
import { handleDriverPayload } from "./payloadHandler.js";

// WebSocket broker for browser
const brokerUrl = "ws://localhost:9001";
const mqttClient = mqtt.connect(brokerUrl, {
  reconnectPeriod: 5000,
  keepalive: 10,
});

// MQTT LISTENER
export function startMQTT(driverId) {
  mqttClient.on("connect", () => {
    console.log("MQTT connected");
    mqttClient.subscribe(`drivers/${driverId}/location`, { qos: 1 }, (err) => {
      if (err) console.error("Subscribe error:", err);
      else console.log(`drivers/${driverId}/location`);
    });
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());

      // DO processing and provide processed data
      await handleDriverPayload(payload);
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  mqttClient.on("error", (err) => console.error("MQTT Error:", err));
  mqttClient.on("offline", () => console.log("MQTT offline"));
  mqttClient.on("reconnect", () => console.log("MQTT reconnecting..."));
}
