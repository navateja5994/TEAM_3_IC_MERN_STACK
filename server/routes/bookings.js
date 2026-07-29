const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

// All booking routes require user authentication
router.use(authMiddleware);

router.post('/create', bookingController.createBooking);
router.post('/confirm-payment', bookingController.confirmPayment);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingDetails);
router.post('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
