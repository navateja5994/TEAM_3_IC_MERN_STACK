const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Public
router.get('/', offerController.getOffers);

// Admin-only Coupons CRUD
router.post('/', authMiddleware, authorize(['admin']), offerController.createOffer);
router.delete('/:id', authMiddleware, authorize(['admin']), offerController.deleteOffer);

module.exports = router;
