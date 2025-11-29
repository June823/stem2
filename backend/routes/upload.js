const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Upload folder
const uploadPath = path.join(__dirname, "..", "uploads", "products");

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload API
router.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  return res.json({
    file_url: `/uploads/products/${req.file.filename}`
  });
});

module.exports = router;
