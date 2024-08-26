// Import Mongoose for defining the schema and model
const mongoose = require("mongoose");

// Define the schema for the Solar Charge Controller collection
const SolarChargeControllerSchema = new mongoose.Schema({
  amperes: {
    type: Number, // The amperage rating of the solar charge controller
    required: true, // This field is required
  },
  cost: {
    type: Number, // The cost of the solar charge controller in currency units (e.g., Naira)
    required: true, // This field is required
  },
});

// Create and export the Solar Charge Controller model based on the schema
const SolarChargeController = mongoose.model(
  "SolarChargeController",
  SolarChargeControllerSchema
);
module.exports = SolarChargeController;
