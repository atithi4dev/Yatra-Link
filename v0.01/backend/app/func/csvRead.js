import multer from "multer";
import { Readable } from "stream";
import csv from "csv-parser";
import Bus from "../models/Bus.js";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB max file size
});

export const csvHandle = async (req, res) => {
  try {
    const results = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const buses = results.map((row) => ({
            registrationNumber: row.registrationNumber,
            operatorName: row.operatorName,
            type: row.type || "Non-AC",
            capacity: Number(row.capacity) || 50,
            route: [
              {
                startStation: row.startStation,
                endStation: row.endStation,
                stops: JSON.parse(row.stops || "[]"),
              },
            ],
            timetable: JSON.parse(row.timetable || "[]"),
          }));

          await Bus.insertMany(buses, { ordered: false });
          res.json({
            message: "CSV processed and buses saved successfully",
            data: buses,
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
