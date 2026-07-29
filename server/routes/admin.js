const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Stats analytics dashboard (Admin only)
router.get('/stats', authMiddleware, authorize(['admin']), adminController.getStats);

module.exports = router;
