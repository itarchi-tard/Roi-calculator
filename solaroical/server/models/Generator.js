// Import Mongoose for defining the schema and model
const mongoose = require("mongoose");

// Define the schema for the Generator collection
const GeneratorSchema = new mongoose.Schema({
  wattage: {
    type: Number, // The wattage of the generator
    required: true, // This field is required
  },
  price: {
    type: Number, // The price of the generator in currency units (e.g., Naira)
    required: true, // This field is required
  },
  fuelConsumption: {
    type: Number, // The fuel consumption of the generator in liters per hour
    required: true, // This field is required
  },
});

// Create and export the Generator model based on the schema
const Generator = mongoose.model("Generator", GeneratorSchema);
module.exports = Generator;
