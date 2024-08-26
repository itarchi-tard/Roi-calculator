// Import Mongoose for defining the schema and model
const mongoose = require("mongoose");

// Define the schema for the Inverter collection
const InverterSchema = new mongoose.Schema({
  size: {
    type: Number, // The size of the inverter in watts
    required: true, // This field is required
  },
  cost: {
    type: Number, // The cost of the inverter in currency units (e.g., Naira)
    required: true, // This field is required
  },
});

// Create and export the Inverter model based on the schema
const Inverter = mongoose.model("Inverter", InverterSchema);
module.exports = Inverter;
