const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* ================================
   CONNECT TO DATABASE
================================ */
connectDB();

/* ================================
   CORS CONFIGURATION
================================ */
app.use(
  cors({
    origin: "https://stem2-12.onrender.com", // your frontend URL
    credentials: true,
  })
);

/* ================================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   SERVE STATIC UPLOADS FOLDER
   VERY IMPORTANT FOR IMAGES
================================ */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ================================
   API ROUTES
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
