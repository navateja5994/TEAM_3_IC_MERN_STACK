const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Public
router.get('/', showController.getShows);
router.get('/:id', showController.getShowById);

// Admin-only CRUD
router.post('/', authMiddleware, authorize(['admin']), showController.createShow);
router.delete('/:id', authMiddleware, authorize(['admin']), showController.deleteShow);

module.exports = router;
