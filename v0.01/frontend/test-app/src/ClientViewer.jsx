import React, { useEffect, useState, useRef } from "react";
import mqtt from "mqtt";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ClientViewer = ({ clientId }) => {
  const [buses, setBuses] = useState([]);
  const clientPosRef = useRef(null); // stable ref for client position

  useEffect(() => {
    if (!clientId) return;

    // Generate a single random position
    const currentPos = {
      lat: 26.85 + Math.random() * 0.05,
      lng: 80.95 + Math.random() * 0.05,
    };
    clientPosRef.current = currentPos; // save in ref

    // Send HTTP POST once
    fetch("http://localhost:5000/api/clients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, currentPos }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Backend response:", data))
      .catch((err) => console.error("Error sending client data:", err));

    // Connect MQTT
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
        const busesArray = Array.isArray(payload) ? payload : [payload];

        // Compute distance using clientPosRef
        const busesWithDistance = busesArray.map((bus) => ({
          ...bus,
          distance:
            clientPosRef.current &&
            getDistanceFromLatLonInKm(
              clientPosRef.current.lat,
              clientPosRef.current.lng,
              bus.lat,
              bus.lng
            ).toFixed(2),
        }));

        console.log("Buses with distance:", busesWithDistance);
        setBuses(busesWithDistance);
      } catch (err) {
        console.error("Error parsing payload:", err);
      }
    });

    mqttClient.on("error", (err) => console.error("MQTT error:", err));
    mqttClient.on("offline", () => console.log(`${clientId} MQTT offline`));
    mqttClient.on("reconnect", () =>
      console.log(`${clientId} MQTT reconnecting`)
    );

    return () => mqttClient.end(true);
  }, [clientId]);

  return (
    <div>
      <h2>Nearby Buses 🚌 ({clientId})</h2>
      {!buses.length ? (
        <p>No buses nearby</p>
      ) : (
        <ul>
          {buses.map((bus, idx) => (
            <li key={bus.busId ?? idx}>
              {bus.busId || bus.driverId}: Lat {bus.lat.toFixed(5)}, Lng{" "}
              {bus.lng.toFixed(5)}, Distance: {bus.distance ?? "N/A"} km
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientViewer;
