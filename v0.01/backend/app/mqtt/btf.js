import mqtt from "mqtt";
import fs from "fs";

// WebSocket broker for browser / frontend clients
const brokerUrl = "ws://localhost:9001";
const mqttClient = mqtt.connect(brokerUrl, {
  reconnectPeriod: 5000,
  keepalive: 10,
});

// File to store published payloads
const FILE_PATH = "./driverPayloads.json";

// --- Start MQTT publisher ---
export function startPublisher() {
  mqttClient.on("connect", () => {
    console.log("MQTT connected for publishing");
  });

  mqttClient.on("error", (err) => console.error("MQTT Error:", err));
  mqttClient.on("offline", () => console.log("MQTT offline"));
  mqttClient.on("reconnect", () => console.log("MQTT reconnecting..."));
}

// --- Publish payload to a client ---
export function publishToClient(clientId, payload) {
  const topic = `clients/${clientId}/nearby`;
  if (payload.length === 0) {
    console.log("No payloads to send");
    return;
  }

  mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 }, (err) => {
    if (err) console.error("Publish error:", err);
    else console.log(`Sent ${payload.length} buses to ${topic}`);
  });
}

// --- Save published payload to local JSON ---
function saveToJson(data, clientId) {
  let existing = [];
  if (fs.existsSync(FILE_PATH)) {
    const fileData = fs.readFileSync(FILE_PATH);
    existing = JSON.parse(fileData.toString() || "[]");
  }

  existing.push({
    clientId,
    payload: data,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(FILE_PATH, JSON.stringify(existing, null, 2));
}
