const Product = require('../../models/productModel')

const undeleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).json({ success: false, error: true, message: 'productId required' })

    const prod = await Product.findById(productId)
    if (!prod) return res.status(404).json({ success: false, error: true, message: 'Product not found' })

    prod.deleted = false
    await prod.save()

    return res.json({ success: true, error: false, message: 'Product restored' })
  } catch (err) {
    console.error('undeleteProduct error', err)
    return res.status(500).json({ success: false, error: true, message: err.message || err })
  }
}

module.exports = undeleteProduct
