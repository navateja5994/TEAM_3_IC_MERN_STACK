const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getGroups);
router.get('/:id', authMiddleware, groupController.getGroupById);
router.post('/:id/members', authMiddleware, groupController.addMembers);
router.delete('/:id/members/:userId', authMiddleware, groupController.removeMember);

module.exports = router;
