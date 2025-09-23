import Bus from "../models/Bus.js";

// @desc    Add new bus
// @route   POST /api/buses
// @access  Admin
export const addBus = async (req, res) => {
  try {
    const busesData = req.body;

    if (!Array.isArray(busesData) || busesData.length === 0) {
      return res
        .status(400)
        .json({ error: "Expected a non-empty array of buses" });
    }

    // Use insertMany for many buses at a time but would shift to queue like rabbitmq or bullmq later;
    const insertedBuses = await Bus.insertMany(busesData, {
      ordered: false,
    });

    res.status(201).json({
      message: `${insertedBuses.insertedCount} buses inserted successfully`,
      data: insertedBuses.insertedIds,
    });
  } catch (error) {
    console.error("Error inserting buses:", error);

    // Handle duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Duplicate registrationNumber found" });
    }

    // Handle validation errors cleanly
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find(
      {},
      "registrationNumber operatorName type route.startStation route.endStation",
    ).lean(); // lean = plain JS objects, faster

    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Public
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Public
export const getBusByRegistrationNo = async (req, res) => {
  try {
    const bus = await Bus.findOne({ registrationNumber: req.params.regNo });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Admin
export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Admin
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
