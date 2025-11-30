const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// 📌 Serve uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", require("./routes/index.js"));

// 📌 Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all route: redirect everything else to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
