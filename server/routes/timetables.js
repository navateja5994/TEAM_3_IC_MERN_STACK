const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { authMiddleware, authorize } = require('../middleware/auth');

router.post('/', authMiddleware, authorize(['admin', 'teacher']), timetableController.createTimetableEntry);
router.put('/:id', authMiddleware, authorize(['admin', 'teacher']), timetableController.updateTimetableEntry);
router.delete('/:id', authMiddleware, authorize(['admin', 'teacher']), timetableController.deleteTimetableEntry);
router.post('/cancel', authMiddleware, authorize(['admin', 'teacher']), timetableController.cancelClass);
router.post('/reschedule', authMiddleware, authorize(['admin', 'teacher']), timetableController.rescheduleClass);
router.post('/substitute', authMiddleware, authorize(['admin', 'teacher']), timetableController.assignSubstitute);
router.get('/date', authMiddleware, timetableController.getTimetableForDate);

module.exports = router;
