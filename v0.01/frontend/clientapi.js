import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const ClientViewer = ({ clientId = "user-1" }) => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Connect to MQTT broker
    const mqttClient = mqtt.connect("ws://localhost:9001");

    mqttClient.on("connect", () => {
      console.log(`${clientId} connected to MQTT broker`);
      mqttClient.subscribe(`clients/${clientId}/nearby`, { qos: 1 }, (err) => {
        if (err) console.error("Subscribe error:", err);
        else console.log(`Subscribed to clients/${clientId}/nearby`);
      });
    });

    mqttClient.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        setBuses(payload); // update buses received
      } catch (err) {
        console.error("Error parsing payload:", err);
      }
    });

    mqttClient.on("error", (err) => console.error("MQTT error:", err));
    mqttClient.on("offline", () => console.log(`${clientId} MQTT offline`));
    mqttClient.on("reconnect", () => console.log(`${clientId} MQTT reconnecting`));

    return () => mqttClient.end(); // cleanup on unmount
  }, [clientId]);

  return (
    <div>
      <h2>Nearby Buses 🚌 ({clientId})</h2>
      {buses.length === 0 ? (
        <p>No buses nearby</p>
      ) : (
        <ul>
          {buses.map((bus) => (
            <li key={bus.busId}>
              {bus.busId}: {bus.lat.toFixed(5)}, {bus.lng.toFixed(5)}, 
              Distance: {bus.distance}m, ETA: {bus.time}min, Source: {bus.source || "unknown"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientViewer;
