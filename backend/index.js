const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ FIXED CORS
const allowedOrigins = [
  "https://stem2-12.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes go here
// app.use("/api", require("./routes/yourRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
