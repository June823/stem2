require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary"); // adjust if path is different
const Product = require("./models/productModel");
const connectDB = require("./config/db");

async function migrateImages() {
  try {
    await connectDB();
    console.log("Connected to DB");

    const products = await Product.find();

    for (let product of products) {
      if (!product.productImage || product.productImage.length === 0) continue;

      const imagePath = product.productImage[0];

      // Only migrate old local uploads
      if (imagePath.startsWith("/uploads")) {
        try {
          const localPath = path.join(__dirname, imagePath);

          console.log("Uploading:", localPath);

          const result = await cloudinary.uploader.upload(localPath, {
            folder: "products",
          });

          product.productImage = [result.secure_url];
          await product.save();

          console.log("Updated:", product.productName);
        } catch (err) {
          console.error("Error with:", product.productName, err.message);
        }
      }
    }

    console.log("Migration complete ✅");
    process.exit();
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
}

migrateImages();
