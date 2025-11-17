const Product = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    const { category } = req.body;

    console.log("🔍 Searching for category:", category);

    if (!category) {
      return res.status(400).json({ 
        success: false,
        message: "Category is required",
        data: [] 
      });
    }

    // Find products that match the category exactly (case-sensitive for exact match)
    let products = await Product.find({
      category: category
    });

    console.log(`✅ Found ${products.length} products with exact match for category: "${category}"`);

    // If no exact match, try case-insensitive
    if (!products.length) {
      products = await Product.find({
        category: { $regex: new RegExp(`^${category}$`, "i") }
      });
      console.log(`✅ Found ${products.length} products with case-insensitive match for category: "${category}"`);
    }

    // Debug: Log first product structure if found
    if (products.length > 0) {
      console.log("📦 Sample product:", {
        _id: products[0]._id,
        productName: products[0].productName,
        category: products[0].category,
        productImage: products[0].productImage,
        price: products[0].price
      });
    } else {
      // Debug: Check what categories exist in database
      const allCategories = await Product.distinct("category");
      console.log("⚠️ No products found. Available categories in DB:", allCategories);
    }

    res.status(200).json({
      success: true,
      message: products.length > 0 ? "Products found" : "No products found",
      data: products,
      error: false
    });
  } catch (error) {
    console.error("Error fetching category-wise products:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message,
      data: []
    });
  }
};

module.exports = getCategoryWiseProduct;
