const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS FIX (must match your frontend URL)
const allowedOrigins = [
  "https://stem2-12.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 IMPORTANT: Mount your main router here
// Make sure this path matches your project structure
const mainRouter = require("./routes/index"); 
app.use("/api", mainRouter);

// Test route (optional)
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
