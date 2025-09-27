import fs from "fs";
import { maybeCheckDeviation } from "../func/graphopper/checkDeviation.js";
import redisClient from "../config/redis.js";
import { publishToClient } from "../mqtt/btf.js"; // <--- add this
const FILE_PATH = "./driverPayloads.json";

export async function handleDriverPayload(payload) {
  console.log("HANDLEDRIVERPAYLOAD")
  const processed = { ...payload };

  const currentPos = {
    lat: payload.lat,
    lng: payload.lng,
  };

  // store current bus position in Redis
  await redisClient.geoAdd("buses", {
    longitude: currentPos.lng,
    latitude: currentPos.lat,
    member: payload.busId,
  });

  saveToJson(processed);

  // optional: run deviation check
  await maybeCheckDeviation(payload, currentPos);

  // ---- Publish to all clients (example: broadcast) ----
  // You can replace this with your actual client list or geo-filter
  const clients = ["atithi", "user-1"];
  clients.forEach((clientId) => {
    publishToClient(clientId, [processed]); // wrap in array
  });
}

function saveToJson(data) {
  let existing = [];

  if (fs.existsSync(FILE_PATH)) {
    const fileData = fs.readFileSync(FILE_PATH);
    try {
      existing = JSON.parse(fileData.toString() || "[]");
    } catch {
      existing = [];
    }
  }

  existing = existing.filter((bus) => bus.busId !== data.busId);
  existing.push(data);

  fs.writeFileSync(FILE_PATH, JSON.stringify(existing, null, 2));
  console.log(`Saved latest payload for bus ${data.busId}`);
}
