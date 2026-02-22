const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ================================
   DATABASE CONNECTION
================================ */
connectDB();

/* ================================
   CORS CONFIGURATION
   (IMPORTANT FOR LOGIN + COOKIES)
================================ */
app.use(
  cors({
    origin: "https://stem2-12.onrender.com", // frontend URL
    credentials: true,
  })
);

/* ================================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 🔥 REQUIRED for auth token in cookies

/* ================================
   SERVE STATIC UPLOADS
   (FOR IMAGES)
================================ */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================================
   ROUTES
================================ */
app.use("/api", require("./routes/index"));

/* ================================
   TEST ROUTE
================================ */
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend is working!" });
});

/* ================================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
