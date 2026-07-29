const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Public
router.get('/', foodController.getFoodItems);

// Admin-only F&B CRUD
router.post('/', authMiddleware, authorize(['admin']), foodController.createFoodItem);
router.put('/:id', authMiddleware, authorize(['admin']), foodController.updateFoodItem);
router.delete('/:id', authMiddleware, authorize(['admin']), foodController.deleteFoodItem);

module.exports = router;
