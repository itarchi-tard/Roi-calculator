const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB using the connectDB function
connectDB();

// Middleware to handle CORS and JSON parsing
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Allow requests from your front-end served on port 5500
  })
);
app.use(express.json());

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "client")));

// Routes: Forward any requests to /api/solar to the solar route handler
app.use("/api/solar", require("./server/routes/solar"));

// Fallback route to serve index.html for any other routes (e.g., for single-page apps)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Start the server and listen on the port specified in the .env file, or default to 5000
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
