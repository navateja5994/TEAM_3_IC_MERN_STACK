const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, voiceController.uploadVoice);

module.exports = router;
