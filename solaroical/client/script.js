// Select the form and results container
const roiForm = document.getElementById("roiForm");
const resultsDiv = document.getElementById("results");

// Add an event listener to handle form submission
roiForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission behavior

  // Extract input values from the form
  const totalLoad = document.getElementById("totalLoad").value;
  const kWhConsumed = document.getElementById("kWhConsumed").value;
  const nepaLightHours = document.getElementById("nepaLightHours").value;
  const backupTime = document.getElementById("backupTime").value;

  // Prepare the data to send to the backend API
  const requestData = {
    totalLoad: parseFloat(totalLoad),
    kWhConsumed: parseFloat(kWhConsumed),
    nepaLightHours: parseFloat(nepaLightHours),
    backupTime: parseFloat(backupTime),
  };

  try {
    // Send the data to the backend API using the Fetch API
    const response = await fetch("http://localhost:5001/api/solar/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // Parse the response JSON
    const data = await response.json();

    if (data.success) {
      // Display the results in the resultsDiv
      document.getElementById("initialSolarCost").textContent =
        data.data.initialSolarCost;
      document.getElementById("initialGeneratorCost").textContent =
        data.data.initialGeneratorCost;
      document.getElementById("monthlyOperatingCost").textContent =
        data.data.monthlyOperatingCost;
      document.getElementById(
        "breakEven"
      ).textContent = `${data.data.breakEven.years} years, ${data.data.breakEven.months} months`;

      // Show the resultsDiv
      resultsDiv.classList.remove("hidden");
    } else {
      alert("Failed to calculate ROI. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while calculating the ROI.");
  }
});
