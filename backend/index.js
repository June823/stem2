const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// ===========================
// ✅ CONNECT TO DATABASE
// ===========================
connectDB();

// ===========================
// ✅ CORS CONFIG (Render-safe)
// ===========================
const allowedOrigins = [
  process.env.FRONTEND_URL, // your deployed frontend (Render fullstack = same domain)
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ BLOCKED by CORS: ${origin}`);
      return callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
}));

// ===========================
// ✅ BODY PARSER + COOKIES
// ===========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ===========================
// ✅ STATIC FILES (Images)
// ===========================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================
// ✅ API ROUTES
// ===========================
app.use('/api/payment', require('./routes/payment'));
app.use('/api', require('./routes'));

// ===========================
// ✅ SERVE REACT FRONTEND (Render)
// ===========================
const frontendBuildPath = path.join(__dirname, 'build');

// serve static frontend
app.use(express.static(frontendBuildPath));

// any non-API route → send React index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// ===========================
// ✅ ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
  if (err?.status === 413 || err?.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large',
    });
  }

  console.error('🔥 SERVER ERROR:', err.message || err);
  res.status(500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

// ===========================
// ✅ START SERVER
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
