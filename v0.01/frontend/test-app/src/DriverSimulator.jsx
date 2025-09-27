import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const DriverSimulator = ({ driverId = "driver-1", busId = driverId }) => {
  const [client, setClient] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (!driverId) return;

    // Connect to MQTT broker
    const mqttClient = mqtt.connect("ws://localhost:9001", {
      reconnectPeriod: 5000,
      keepalive: 10,
    });

    mqttClient.on("connect", () => {
      console.log(`Driver ${driverId} connected to MQTT broker`);
    });

    mqttClient.on("error", (err) => console.error("MQTT Error:", err));
    mqttClient.on("offline", () => console.log("MQTT offline"));
    mqttClient.on("reconnect", () => console.log("MQTT reconnecting..."));

    setClient(mqttClient);

    // Cleanup on unmount
    return () => {
      mqttClient.end();
      if (intervalId) clearInterval(intervalId);
    };
  }, [driverId]);

  const startPublishing = () => {
    if (!client || publishing) return;

    const id = setInterval(() => {
      const payload = {
        driverId,
        busId,
        lat: 26.85 + Math.random() * 0.01,
        lng: 80.95 + Math.random() * 0.01,
        timestamp: new Date().toISOString(),
        source: "app",
      };

      client.publish(
        `drivers/${driverId}/location`,
        JSON.stringify(payload),
        { qos: 1 }
      );
      console.log(
        `Published location for ${busId}: ${payload.lat.toFixed(
          5
        )}, ${payload.lng.toFixed(5)}`
      );
    }, 200); // publish every 200ms

    setIntervalId(id);
    setPublishing(true);
  };

  return (
    <div>
      <h2>Driver Simulator 🚍</h2>
      <p>Bus: {busId}</p>
      <button onClick={startPublishing} disabled={publishing}>
        {publishing ? "Publishing..." : "Start Sharing Location"}
      </button>
    </div>
  );
};

export default DriverSimulator;
