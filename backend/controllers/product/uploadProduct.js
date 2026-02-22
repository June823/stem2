const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");
const Product = require("../../models/productModel");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("productImage", 10);

const UploadProductController = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const { productName, category, description, price } = req.body;

      if (!productName || !category || !price) {
        return res.status(400).json({
          success: false,
          message: "Product name, category, and price are required",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one product image is required",
        });
      }

      const productImage = req.files.map((file) => file.path);

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
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error uploading product",
        error: error.message,
      });
    }
  });
};

module.exports = UploadProductController;
