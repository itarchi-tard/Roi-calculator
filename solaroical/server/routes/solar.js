// Import required modules
const express = require("express");
const router = express.Router();
const { calculateSolarROI } = require("../controllers/solarController");

// Define a POST route for solar ROI calculation
// This route triggers the calculateSolarROI function in the controller
router.post("/calculate", calculateSolarROI);

// Export the router for use in the main server file
module.exports = router;
