const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// connect to DB
connectDB();

// middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('CORS policy: origin not allowed'));
    }
  },
  credentials: true,
}));

// increase payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// payment route
const paymentRoute = require('./routes/payment');
app.use('/api/payment', paymentRoute);

// other API routes
const routes = require('./routes');
app.use('/api', routes);

// ============================
// ✅ Serve React frontend
// ============================
const frontendBuildPath = path.join(__dirname, 'build'); // make sure 'build' folder is inside backend
app.use(express.static(frontendBuildPath));

// For any route not starting with /api, serve React's index.html
app.get('*', (req, res) => {
  // if the route starts with /api, skip
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      success: false,
      error: true,
      message: 'Payload too large. Increase request size limit or reduce payload size.',
    });
  }
  if (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      success: false,
      error: true,
      message: err.message || 'Server error',
    });
  }
  next();
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
