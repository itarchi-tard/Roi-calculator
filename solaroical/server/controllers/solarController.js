// Import the service function that performs the solar ROI calculations
const { calculateSolarROIService } = require("../services/solarService");

// Controller function for handling solar ROI calculation requests
const calculateSolarROI = async (req, res) => {
  try {
    // Call the service that handles the solar ROI calculation logic
    const result = await calculateSolarROIService(req.body);

    // Respond with the calculation result
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // Handle errors and respond with the error message
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export the controller function for use in the route
module.exports = { calculateSolarROI };
