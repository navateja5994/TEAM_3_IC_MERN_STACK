const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const { phoneLookupRateLimiter } = require('../middleware/rateLimiter');

router.get('/search', authMiddleware, phoneLookupRateLimiter, userController.searchByPhone);
router.get('/contacts', authMiddleware, userController.getContacts);
router.post('/block', authMiddleware, userController.blockUser);
router.post('/unblock', authMiddleware, userController.unblockUser);
router.post('/report', authMiddleware, userController.reportUser);
router.get('/online', authMiddleware, userController.getOnlineUsers);

module.exports = router;
