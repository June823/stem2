require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const connectDB = require("./config/db");

const CLOUDINARY_BASE = "https://res.cloudinary.com/ddozgkmp1/image/upload/products/";

async function updateImages() {
  await connectDB();
  console.log("Connected to DB");

  const products = await Product.find();

  for (let product of products) {
    if (!product.productImage || product.productImage.length === 0) continue;

    const oldPath = product.productImage[0];

    if (oldPath.startsWith("/uploads")) {
      const fileName = oldPath.split("/").pop();

      const newUrl = CLOUDINARY_BASE + fileName;

      product.productImage = [newUrl];
      await product.save();

      console.log("Updated:", product.productName);
    }
  }

  console.log("All products updated ✅");
  process.exit();
}

updateImages();
