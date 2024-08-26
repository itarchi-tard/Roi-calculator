// Import the models for interacting with the database
const Inverter = require("../models/Inverter");
const Generator = require("../models/Generator");
const SolarChargeController = require("../models/SolarChargeController");

// Service function to perform the solar ROI calculations
const calculateSolarROIService = async (inputData) => {
  try {
    // Extract input data from the request body
    const { totalLoad, kWhConsumed, nepaLightHours, backupTime } = inputData;

    // If both totalLoad and kWhConsumed are provided, prioritize totalLoad
    const load = totalLoad || kWhConsumed / nepaLightHours;

    if (!load || load <= 0) {
      throw new Error("Invalid load value calculated from input data.");
    }

    // Base logic for backup time (subtract 4 hours of peak sunlight)
    const backupTimeAfterSunlight = backupTime - 4;
    if (backupTimeAfterSunlight <= 0) {
      throw new Error("Backup time must be greater than 4 hours.");
    }

    // Fetch an inverter from the database that matches or exceeds the calculated load
    const inverter = await Inverter.findOne({
      "Inverter Size (w)": { $gte: load * 2 },
    });
    if (!inverter) {
      throw new Error("No suitable inverter found for the specified load.");
    }

    // Fetch a generator from the database that matches or exceeds the calculated load
    const generator = await Generator.findOne({
      "GENSET wattage": { $gte: load },
    });
    if (!generator) {
      throw new Error("No suitable generator found for the specified load.");
    }

    // Base battery setup: number of batteries and cost per battery
    const baseBatteryNumber = 2;
    const baseBatteryCost = 145000; // Cost per battery
    const baseBackupTime = (24 * 150 * 0.8 * 0.8) / load; // Example calculation for base backup time

    // Calculate additional batteries needed if the required backup time exceeds the base backup time
    let extraBatteries = 0;
    if (backupTimeAfterSunlight > baseBackupTime) {
      const additionalAhNeeded =
        (backupTimeAfterSunlight - baseBackupTime) * load;
      extraBatteries = Math.ceil(additionalAhNeeded / (150 * 0.8)); // Calculate the number of extra batteries needed
    }

    // Calculate the total battery cost
    const totalBatteryCost =
      baseBatteryCost * (baseBatteryNumber + extraBatteries);

    // Calculate the total solar panel wattage required to charge the batteries (adjusted for operational losses)
    const totalPanelWattage =
      (24 * 150 * (baseBatteryNumber + extraBatteries)) / 4 / 0.7; // Simplified calculation
    const numberOfPanels = Math.ceil(totalPanelWattage / 300); // Assuming 300W panels

    // Calculate the required amperage for the solar charge controller
    const totalControllerAmps = numberOfPanels * 8.85;

    // Log the calculated amperage for debugging purposes
    console.log(`Calculated Controller Amps: ${totalControllerAmps}`);

    // Fetch the solar charge controller from the database
    const SolarChargeController = await SolarChargeController.findOne({
      "Solar charge controller Amperes": { $gte: totalControllerAmps },
    });

    if (!solarChargeController) {
      // Log available controllers for debugging
      const availableControllers = await SolarChargeController.find({});
      console.log("Available Solar Charge Controllers:", availableControllers);

      throw new Error("No suitable solar charge controller found.");
    }

    // Calculate the monthly operating cost of the generator
    const monthlyOperatingCost =
      generator["fuel consumption l/hr"] * 30 * generator["GENSET wattage"];

    // Calculate the initial costs for the solar setup and the generator
    const initialSolarCost = totalBatteryCost + numberOfPanels * 100000; // Simplified calculation for panel costs
    const initialGeneratorCost = generator.Price;

    // Calculate the break-even point (in months) between the solar and generator costs
    const breakEvenMonths = Math.ceil(
      (initialSolarCost - initialGeneratorCost) / monthlyOperatingCost
    );
    const breakEvenYears = Math.floor(breakEvenMonths / 12);
    const remainingMonths = breakEvenMonths % 12;

    // Log the result for debugging purposes
    console.log({
      initialSolarCost,
      initialGeneratorCost,
      monthlyOperatingCost,
      breakEven: { years: breakEvenYears, months: remainingMonths },
    });

    // Return the calculated data as the result
    return {
      initialSolarCost,
      initialGeneratorCost,
      monthlyOperatingCost,
      breakEven: { years: breakEvenYears, months: remainingMonths },
    };
  } catch (error) {
    console.error("Error in calculateSolarROIService:", error.message);
    throw error;
  }
};

// Export the service function for use in the controller
module.exports = { calculateSolarROIService };
