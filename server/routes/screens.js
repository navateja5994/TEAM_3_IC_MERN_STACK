const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Public / Internal
router.get('/', screenController.getScreens);

// Admin-only CRUD
router.post('/', authMiddleware, authorize(['admin']), screenController.createScreen);
router.delete('/:id', authMiddleware, authorize(['admin']), screenController.deleteScreen);

module.exports = router;
