const Product = require('../../models/productModel')
const fs = require('fs')
const path = require('path')

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).json({ success: false, error: true, message: 'productId required' })

    const prod = await Product.findById(productId)
    if (!prod) return res.status(404).json({ success: false, error: true, message: 'Product not found' })

    // soft-delete: mark deleted flag so we can undo from admin UI
    prod.deleted = true
    await prod.save()

    return res.json({ success: true, error: false, message: 'Product moved to trash' })
  } catch (err) {
    console.error('deleteProduct error', err)
    return res.status(500).json({ success: false, error: true, message: err.message || err })
  }
}

module.exports = deleteProduct
