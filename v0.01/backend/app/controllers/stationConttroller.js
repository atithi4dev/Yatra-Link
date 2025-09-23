import Station from "../models/Station.js";

// @desc    Add a new station
// @route   POST /api/stations
// @access  Admin
export const addStation = async (req, res) => {
  try {
    const { stationCode, name, city, state, location, facilities, buses } = req.body;

    // Check if station already exists
    const existing = await Station.findOne({ stationCode });
    if (existing) {
      return res.status(400).json({ message: "Station code already exists" });
    }

    const station = await Station.create({
      stationCode,
      name,
      city,
      state,
      location,
      facilities,
      buses,
    });

    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stations
// @route   GET /api/stations
// @access  Public
export const getStations = async (req, res) => {
  try {
    const stations = await Station.find().populate("buses");
    res.json(stations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get station by ID
// @route   GET /api/stations/:id
// @access  Public
export const getStationById = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id).populate("buses");

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update station
// @route   PUT /api/stations/:id
// @access  Admin
export const updateStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    const updates = req.body;
    Object.assign(station, updates);

    const updatedStation = await station.save();
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete station
// @route   DELETE /api/stations/:id
// @access  Admin
export const deleteStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    await station.deleteOne();
    res.json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
