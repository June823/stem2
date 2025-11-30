const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Serve React build
const frontendPath = path.join(__dirname, "client", "build");
app.use(express.static(frontendPath));

// **Catch-all route for React (works with any version)**
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
