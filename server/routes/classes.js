const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize(['admin', 'teacher']), classController.createClass);
router.get('/', authMiddleware, classController.getClasses);
router.get('/my', authMiddleware, classController.getMyClasses);
router.post('/:classId/members', authMiddleware, authorize(['admin', 'teacher']), classController.enrollClassMember);
router.delete('/:classId/members/:userId', authMiddleware, authorize(['admin', 'teacher']), classController.removeClassMember);
router.get('/:classId/members', authMiddleware, classController.getClassMembers);

module.exports = router;
