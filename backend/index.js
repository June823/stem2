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

// 🔥 IMPORTANT
app.use(cookieParser());

app.use(
  cors({
    origin: "https://stem2-12.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
