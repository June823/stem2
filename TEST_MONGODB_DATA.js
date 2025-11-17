// Test MongoDB Data - Run this in MongoDB shell or Node.js with mongoose
// This will help verify your products are correctly stored

const mongoose = require('mongoose');

// Connect to your database (update connection string)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true },
  productImage: { type: [String], default: [] },
  description: { type: String },
  price: { type: Number, required: true },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function testData() {
  await connectDB();
  
  console.log('\n🔍 Testing MongoDB Data...\n');
  
  // Count products by category
  const basketsCount = await Product.countDocuments({ category: 'baskets' });
  console.log(`📊 Baskets products: ${basketsCount}`);
  
  // Get sample basket product
  const sampleBasket = await Product.findOne({ category: 'baskets' });
  if (sampleBasket) {
    console.log('\n📦 Sample Basket Product:');
    console.log('  - ID:', sampleBasket._id);
    console.log('  - Name:', sampleBasket.productName);
    console.log('  - Category:', sampleBasket.category);
    console.log('  - Price:', sampleBasket.price);
    console.log('  - ProductImage:', JSON.stringify(sampleBasket.productImage, null, 2));
    console.log('  - Image Array Length:', sampleBasket.productImage?.length || 0);
    console.log('  - First Image:', sampleBasket.productImage?.[0] || 'MISSING');
  } else {
    console.log('❌ No basket products found!');
  }
  
  // Check all categories
  const allCategories = await Product.distinct('category');
  console.log('\n📋 All Categories in DB:', allCategories);
  
  // Count products per category
  for (const category of allCategories) {
    const count = await Product.countDocuments({ category });
    console.log(`  - ${category}: ${count} products`);
  }
  
  // Check products with missing/empty images
  const productsWithEmptyImages = await Product.find({
    $or: [
      { productImage: { $exists: false } },
      { productImage: { $size: 0 } },
      { productImage: { $in: [null, ''] } }
    ]
  });
  
  if (productsWithEmptyImages.length > 0) {
    console.log(`\n⚠️ Found ${productsWithEmptyImages.length} products with missing/empty images:`);
    productsWithEmptyImages.forEach(p => {
      console.log(`  - ${p.productName} (${p.category}): productImage =`, p.productImage);
    });
  } else {
    console.log('\n✅ All products have images');
  }
  
  mongoose.connection.close();
}

// Run if executed directly
if (require.main === module) {
  testData().catch(console.error);
}

module.exports = testData;




