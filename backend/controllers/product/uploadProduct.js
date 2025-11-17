const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../../models/productModel");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || "products";
    const uploadPath = path.join("uploads", "products", category);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Keep original name or generate unique name
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).array("productImage", 10); // Allow up to 10 images

const UploadProductController = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }

    try {
      const { productName, category, description, price } = req.body;

      // Validation
      if (!productName || !category || !price) {
        return res.status(400).json({ 
          success: false,
          message: "Product name, category, and price are required" 
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false,
          message: "At least one product image is required" 
        });
      }

      // Build image paths
      const productImage = req.files.map(file => {
        const category = req.body.category || "products";
        return `/uploads/products/${category}/${file.filename}`;
      });

      const product = await Product.create({
        productName,
        category,
        productImage,
        description: description || "",
        price: parseFloat(price),
      });

      res.status(201).json({ 
        success: true,
        message: "Product uploaded successfully",
        data: product 
      });
    } catch (error) {
      console.error("Error uploading product:", error);
      res.status(500).json({ 
        success: false,
        message: "Error uploading product",
        error: error.message 
      });
    }
  });
};

module.exports = UploadProductController;
