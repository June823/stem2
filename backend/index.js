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
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// 📌 Serve uploaded product images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES — KEEP ONLY WHAT EXISTS
app.use("/api/products", require("./routes/productRoutes"));

// ❌ REMOVE routes that don't exist (to stop Render errors)
// app.use("/api/users", require("./routes/userRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/orders", require("./routes/orderRoutes"));

// 📌 Serve frontend build on Render
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
