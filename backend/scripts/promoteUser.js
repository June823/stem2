/**
 * Promote a user to ADMIN role.
 * Usage:
 *   node backend/scripts/promoteUser.js --id 69038c0765ff3bd3e4caa216
 *   or
 *   node backend/scripts/promoteUser.js --email user@example.com
 *
 * Make sure MONGODB_URI is set in your environment or in a .env file at backend/.env
 */

const mongoose = require('mongoose')
const path = require('path')
// Try loading .env from repo root first, then fallback to backend/.env
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '..', '.env') })
}

const User = require('../models/userModel')

async function run() {
  const argv = process.argv.slice(2)
  let id = null
  let email = null
  argv.forEach((arg, idx) => {
    if (arg === '--id') id = argv[idx + 1]
    if (arg === '--email') email = argv[idx + 1]
  })

  if (!id && !email) {
    console.error('Please provide --id <userId> or --email <email>')
    process.exit(1)
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
  if (!mongoUri) {
    console.error('MONGODB_URI not set in environment. Please set it or add a .env file in backend/.')
    process.exit(1)
  }

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('Connected to MongoDB')

  const query = id ? { _id: id } : { email }
  const user = await User.findOne(query)
  if (!user) {
    console.error('User not found for', query)
    process.exit(1)
  }

  user.role = 'ADMIN'
  await user.save()

  console.log(`Promoted user ${user._id} (${user.email}) to ADMIN`)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch(err => {
  console.error('Error promoting user:', err)
  process.exit(1)
})
