const Product = require('../../models/productModel')
const User = require('../../models/userModel')

module.exports = async (req, res) => {
  try {
    const productsCount = await Product.countDocuments({ deleted: { $ne: true } })
    const usersCount = await User.countDocuments()
    const recentProducts = await Product.find({ deleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productName category price productImage createdAt')

    return res.json({
      success: true,
      products: productsCount,
      users: usersCount,
      pendingOrders: 0,
      recentProducts,
    })
  } catch (err) {
    console.error('admin summary error', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}
