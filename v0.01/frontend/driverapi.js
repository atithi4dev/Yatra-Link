import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const DriverSimulator = ({ driverId = "driver-1", busId = "bus-101" }) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
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
    return () => mqttClient.end();
  }, [driverId]);

  // Publish location at interval
  useEffect(() => {
    if (!client) return;

    const interval = setInterval(() => {
      const payload = {
        driverId,
        busId,
        // lat: 26.85 + Math.random() * 0.01,         //pls upload it the geo location
        // lng: 80.95 + Math.random() * 0.01,
        timestamp: new Date().toISOString(),
        source: "app", // can be "app" or "web"
      };

      client.publish(`drivers/${driverId}/location`, JSON.stringify(payload), {
        qos: 1,
      });
      console.log(
        `Published location for ${busId}: ${payload.lat.toFixed(5)}, ${payload.lng.toFixed(5)}`,
      );
    }, 500); // 500ms interval

    return () => clearInterval(interval);
  }, [client, driverId, busId]);

  return (
    <div>
      <h2>Driver Simulator 🚍</h2>
      <p>Publishing location for Bus: {busId}</p>
    </div>
  );
};

export default DriverSimulator;
