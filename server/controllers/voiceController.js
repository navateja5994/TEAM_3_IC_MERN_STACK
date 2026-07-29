const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Extract extension, default to .webm for browser audio
    let ext = path.extname(file.originalname);
    if (!ext) {
      if (file.mimetype === 'audio/webm') ext = '.webm';
      else if (file.mimetype === 'audio/wav') ext = '.wav';
      else if (file.mimetype === 'audio/mpeg') ext = '.mp3';
      else ext = '.webm';
    }
    cb(null, `voice-${uniqueSuffix}${ext}`);
  }
});

// Multer filter to accept only audio files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

exports.uploadVoice = (req, res, next) => {
  // Use multer single file upload middleware
  const singleUpload = upload.single('voice');

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded.' });
    }

    // Return the relative URL of the uploaded file
    const mediaUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'Audio uploaded successfully.',
      mediaUrl
    });
  });
};
