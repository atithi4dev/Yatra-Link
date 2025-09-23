import fs from "fs";
import { maybeCheckDeviation } from "../func/graphopper/checkDeviation.js";

const FILE_PATH = "./driverPayloads.json";

export async function handleDriverPayload(payload) {
  const processed = {
    ...payload,

    // payload coming from the frontend- {
    //         busId,
    //         driverId,
    //         // lat: 26.85
    //         // lng: 80.32
    //         timestamp: new Date().toISOString(),
    //         source: "app", // can be "app" or "web"
    //       }

    //   processedAt: new Date().toISOString(),             -- to add more
  };

  const currentPos = {
    lat: payload.lat,
    lng: payload.lng,
  };

  // storing the current pos of the bus in Redis
  await redis.geoAdd("buses", {
    ...currentPos,
    member: payload.busId,
  });

  saveToJson(processed);

  // running the check for diversion- every 5 sec;
  await maybeCheckDeviation(payload, currentPos);
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
