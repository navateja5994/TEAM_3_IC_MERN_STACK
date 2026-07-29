const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, messageController.sendMessage);
router.get('/conversation/:conversationId', authMiddleware, messageController.getMessagesByConversation);
router.post('/acknowledge/:messageId', authMiddleware, messageController.acknowledgeMessage);
router.get('/acknowledgements/:messageId', authMiddleware, messageController.getAcknowledgementStats);

module.exports = router;
