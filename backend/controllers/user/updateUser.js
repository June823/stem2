const userModel = require("../../models/userModel")
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// configure multer storage for user profile pictures
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join('uploads', 'users')
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('profilePic')

async function updateUser(req, res) {
    // use multer to handle optional profilePic upload
    upload(req, res, async function (err) {
        try {
            if (err) {
                return res.status(400).json({ success: false, message: err.message })
            }

            const sessionUser = req.userId
            const { userId, email, name, role } = req.body

            const payload = {
                ...(email && { email: email }),
                ...(name && { name: name }),
                ...(role && { role: role }),
            }

            // if a file was uploaded, set profilePic path
            if (req.file) {
                payload.profilePic = `/uploads/users/${req.file.filename}`
            }

            const user = await userModel.findById(sessionUser)
            if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' })

            // Only admins can update arbitrary users; route already protected by adminOnly
            const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true })

            res.json({ data: updateUser, message: 'User Updated', success: true, error: false })
        } catch (err) {
            res.status(400).json({ message: err.message || err, error: true, success: false })
        }
    })
}

module.exports = updateUser