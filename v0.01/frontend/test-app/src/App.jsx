import React, { useState } from "react";
import ClientViewer from "./ClientViewer";
import DriverSimulator from "./DriverSimulator";

const App = () => {
  const [mode, setMode] = useState("driver"); // 'driver' or 'client'

  const [driverId, setDriverId] = useState("");
  const [clientId, setClientId] = useState("");

  const [submittedDriverId, setSubmittedDriverId] = useState("");
  const [submittedClientId, setSubmittedClientId] = useState("");

  // Driver click: set submitted ID and trigger backend HTTP request
  const handleDriverStart = () => {
    if (!driverId.trim()) return;
    const id = driverId.trim();
    setSubmittedDriverId(id);

    // Send ready status to backend
    fetch("http://localhost:5000/api/drivers/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driverId: id, status: "READY" }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Driver backend response:", data))
      .catch((err) => console.error("Driver HTTP error:", err));
  };

  // Client click: set submitted ID and send current position
  const handleClientStart = () => {
    if (!clientId.trim()) return;
    const id = clientId.trim();
    setSubmittedClientId(id);

    const currentPos = {
      lat: 26.85 + Math.random() * 0.05,
      lng: 80.95 + Math.random() * 0.05,
    };

    fetch("http://localhost:5000/api/clients/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: id, currentPos }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Client backend response:", data))
      .catch((err) => console.error("Client HTTP error:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🚌 Saarthi YatraLink Test</h1>

      {/* Mode Selection */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setMode("driver")}
          style={{
            marginRight: "10px",
            backgroundColor: mode === "driver" ? "#4caf50" : "#ccc",
          }}
        >
          Driver Mode
        </button>
        <button
          onClick={() => setMode("client")}
          style={{
            backgroundColor: mode === "client" ? "#2196f3" : "#ccc",
          }}
        >
          Client Mode
        </button>
      </div>

      {/* Driver Mode */}
      {mode === "driver" && (
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Enter Driver ID"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <button onClick={handleDriverStart}>Ready & Start Publishing</button>
          {submittedDriverId && (
            <div style={{ marginTop: "20px" }}>
              <DriverSimulator driverId={submittedDriverId} />
            </div>
          )}
        </div>
      )}

      {/* Client Mode */}
      {mode === "client" && (
        <div style={{ marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="Enter Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />
          <button onClick={handleClientStart}>Send Current Location</button>
          {submittedClientId && (
            <div style={{ marginTop: "20px" }}>
              <ClientViewer clientId={submittedClientId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
