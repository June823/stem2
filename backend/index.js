const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB"); // <-- IMPORTANT

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔥 Connect to MongoDB FIRST
connectDB();

// ✅ CORS Configuration
app.use(
  cors({
    origin: "https://stem2-12.onrender.com",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Mount all API routes
app.use("/api", require("./routes/index"));

// Test route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
