const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // adjust if you want to restrict to frontend domain
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded product images
// Make sure your uploads folder exists
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use your existing routes
app.use("/api", require("./routes/index.js"));

// Serve frontend build on Render
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
