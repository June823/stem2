const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// ================== PORT ===================
const PORT = process.env.PORT || 8080;

// ================== DB =====================
connectDB();

// ================== CORS ===================
const allowedOrigins = [
  process.env.FRONTEND_URL,        // Render frontend
  "https://stem2-8.onrender.com",  // If frontend served from backend
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman, mobile apps

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS Blocked Origin:", origin);
        callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

// ================== PARSERS ==================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// ================== STATIC UPLOADS ===========
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads folder exists (Render deletes empty folders)
const fs = require("fs");
const uploadsPath = path.join(__dirname, "uploads", "products");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// ================== API ROUTES ================
app.use("/api/upload", require("./routes/upload"));  // <--- Upload route
app.use("/api/payment", require("./routes/payment"));
app.use("/api", require("./routes")); // must be last API route

// ================== FRONTEND ================
const frontendBuild = path.join(__dirname, "build");
app.use(express.static(frontendBuild));

// React Router fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuild, "index.html"));
});

// ================== ERROR HANDLER =============
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================== START =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
