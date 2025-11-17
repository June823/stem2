const userModel = require('../models/userModel')

const adminOnly = async (req, res, next) => {
  try {
    const userId = req.userId
    if (!userId) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' })

    const user = await userModel.findById(userId)
    if (!user) return res.status(401).json({ success: false, error: true, message: 'Unauthorized' })

    const role = (user.role || '').toString().toUpperCase()
    if (role !== 'ADMIN' && role !== 'ADMINISTRATOR') {
      return res.status(403).json({ success: false, error: true, message: 'Admin only' })
    }

    next()
  } catch (err) {
    console.error('adminOnly middleware error', err)
    return res.status(500).json({ success: false, error: true, message: 'Server error' })
  }
}

module.exports = adminOnly
