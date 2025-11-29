const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Render dynamic port
const PORT = process.env.PORT || 8080;

// DB connect
connectDB();

// Allowed CORS origins
const allowedOrigins = [
  process.env.FRONTEND_URL,  // MUST be set in Render env
  "https://stem2-8.onrender.com", // (if serving frontend from backend)
  "http://localhost:3000",
  "http://localhost:3001",
];

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked:", origin);
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

// Body limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= API ROUTES =================
app.use("/api", require("./routes"));
app.use("/api/payment", require("./routes/payment"));

// ================= FRONTEND BUILD ===============
const frontendBuild = path.join(__dirname, "build");
app.use(express.static(frontendBuild));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuild, "index.html"));
});

// ================ ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
