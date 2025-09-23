import { redis } from "../../index.js"; // your redis client
import distance from "@turf/distance";
import { point } from "@turf/helpers";
import Bus from "../../models/Bus.js";

let lastCheck = 0;

//  check for the lat and long vice versa type shit!

function deviationFromRoute(routeCoords, currentPos) {
  // routeCoords: [[ lat, lng ], ...]
  // currentPos: { lat, lng }

  const busPoint = point([currentPos.lng, currentPos.lat]);

  let minDist = Infinity;
  for (const coord of routeCoords) {
    const routePoint = point([coord.lng, coord.lat]);
    const dist = distance(busPoint, routePoint, { units: "meters" });
    minDist = Math.min(minDist, dist);
  }
  return minDist; // meters
}

// adding the bus along with the driverId to redis
// await redis.geoAdd("buses", {
// ...currentPos,
// member: payload.busId,
// });
//
//await redis.hSet(`bus:${payload.busId}`, {
//   driverId: payload.driverId,
//   busId
//   bus ki details  --       to send beautifully
//   routeCoords: JSON.stringify(routeCoords),
//   endStation: [ lat,long  ],
//   any other metadata
// });

export async function maybeCheckDeviation(payload, currentPos) {
  const now = Date.now();
  const busId = payload.busId; // busId is the registrationNo in db

  if (now - lastCheck >= 5000) {
    lastCheck = now;

    const bus = await Bus.findOne(
      { registrationNumber: busId },
      { "route.endStation": 1, _id: 0 },
    );

    if (bus && bus.route && bus.route.endStation) {
      const { lat, lng } = bus.route.endStation;
      await redis
        .multi()
        .hset(`bus:${busId}`, {
          busId,
          driverId: payload.driverId,
          endStation: JSON.stringify({ lat, lng }),
        })
        .expire(`bus:${busId}`, 180) // this refreshes TTL every update
        .exec();

      const routeCoordsData = await redis.hGet(`bus:${busId}`, "routeCoords");
      const routeCoords = routeCoordsData ? JSON.parse(routeCoordsData) : [];

      if (routeCoords == null || routeCoords.length === 0) {
        console.log(
          `Calculating coords for the first time for route: ${payload.driverId}`,
        );
        await recalcRoute(currentPos, busId, { lat, lng });
        return;
      }

      const deviation = deviationFromRoute(routeCoords, currentPos);

      if (deviation > 50) {
        // about half a football field
        console.log("Bus off route, recalculating...");
        await recalcRoute(currentPos, busId, { lat, lng });
      } else {
        console.log("Bus on route.");
      }
    }
  }
}

async function recalcRoute(currentPos, busId, endStation) {
  const url = "https://graphhopper.com/api/1/route";
  const apiKey = process.env.GRAPHOPPER_API;

  // Use current bus position and end station
  const body = {
    points: [
      [currentPos.lng, currentPos.lat], // current position
      [endStation.lng, endStation.lat], // destination
    ],
    snap_preventions: ["motorway", "ferry", "tunnel"],
    details: ["road_class", "surface"],
    profile: "truck",
    locale: "en",
    instructions: true,
    calc_points: true,
    points_encoded: false,
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();
    const routeCoords = data.paths[0].points.coordinates;

    await redis.hSet(`bus:${busId}`, {
      routeCoords: JSON.stringify(routeCoords),
    });

    console.log(`Route successfully updated in Redis for bus ${busId}`);
  } catch (error) {
    console.error("Error recalculating route:", error);
  }
}
