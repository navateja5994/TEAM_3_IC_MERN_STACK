const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Establish Database Connection
connectDB();

const app = express();
const server = http.createServer(app);

// Mount Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded movie posters/assets statically
app.use('/uploads', express.static(uploadsDir));

// Image Upload Endpoint (Multer configuration)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select an image file to upload.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Mount Mall CineBook API Route Definitions
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/screens', require('./routes/screens'));
app.use('/api/shows', require('./routes/shows'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/food', require('./routes/food'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/admin', require('./routes/admin'));

// Basic Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', app: 'Mall CineBook API', timestamp: new Date() });
});

// Global Error Middleware
app.use(errorHandler);

// Listen on designated port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Mall CineBook API Server running on http://localhost:${PORT}`);
});
