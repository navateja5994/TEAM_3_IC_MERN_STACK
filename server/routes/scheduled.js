const express = require('express');
const router = express.Router();
const scheduledController = require('../controllers/scheduledController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, scheduledController.createScheduledMessage);
router.get('/', authMiddleware, scheduledController.getScheduledMessages);
router.put('/:id', authMiddleware, scheduledController.updateScheduledMessage);
router.delete('/:id', authMiddleware, scheduledController.cancelScheduledMessage);
router.post('/:id/reschedule', authMiddleware, scheduledController.rescheduleMessage);

module.exports = router;
