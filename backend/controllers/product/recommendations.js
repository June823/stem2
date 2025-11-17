const Product = require('../../models/productModel')

// Simple content-based recommender: return products in same category
// sorted by price closeness to the given product. Limits results to 6.
const recommendations = async (req, res) => {
  try {
    const productId = req.query.productId
    if (!productId) {
      return res.status(400).json({ success: false, error: true, message: 'productId is required' })
    }

    const target = await Product.findById(productId).lean()
    if (!target) {
      return res.status(404).json({ success: false, error: true, message: 'Product not found' })
    }

    const targetPrice = (target.sellingPrice || target.price || 0)
    const category = target.category

    // fetch candidates in same category excluding the product itself
    const candidates = await Product.find({ category: category, _id: { $ne: productId } }).lean().limit(50)

    // compute distance by price and sort
    const scored = candidates.map(p => {
      const price = (p.sellingPrice || p.price || 0)
      return { product: p, score: Math.abs(price - targetPrice) }
    })

    scored.sort((a, b) => a.score - b.score)

    const results = scored.slice(0, 6).map(s => {
      // attach small helper fields to explain why this was recommended
      const p = s.product
      p._recScore = s.score // absolute price diff
      // percentage difference (avoid divide by zero)
      const base = (targetPrice || 1)
      p._recPct = Math.round((s.score / base) * 10000) / 100 // percent with 2 decimals
      p._recReason = s.score === 0 ? 'same_price' : 'price_proximity'
      return p
    })

    return res.json({ success: true, error: false, data: results })
  } catch (err) {
    console.error('Recommendations error', err)
    return res.status(500).json({ success: false, error: true, message: err.message || err })
  }
}

module.exports = recommendations
