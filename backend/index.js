const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(cookieParser());

// ✅ FULLY CORRECTED CORS FOR RENDER
app.use(
  cors({
    origin: "https://stem2-12.onrender.com", // Your exact frontend URL
    credentials: true,                        // Allows cookies to be sent/received
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ IMAGE FIX: Serve static files from 'uploads' folder
// This ensures that local/Cloudinary fallback images actually load
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
