const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Add your other API routes here
// Example:
// app.use("/api/products", require("./routes/products"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
