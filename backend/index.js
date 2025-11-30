// index.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// TODO: Add more API routes here
// Example: app.use("/api/products", require("./routes/products"));

// Serve frontend from React build (for Render)
const frontendPath = path.join(__dirname, "client", "build"); // adjust if your React build is elsewhere
app.use(express.static(frontendPath));

// Catch-all route to serve React's index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
