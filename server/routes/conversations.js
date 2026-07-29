const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, conversationController.getConversations);
router.get('/:id', authMiddleware, conversationController.getConversationById);
router.post('/direct', authMiddleware, conversationController.startDirectConversation);
router.post('/:id/share-details', authMiddleware, conversationController.shareDetails);

module.exports = router;
