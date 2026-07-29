const mongoose = require('mongoose');

const BookingSeatSchema = new mongoose.Schema({
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true
  },
  seatNumber: {
    type: String, // e.g. 'A1', 'H12'
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'booked'],
    default: 'booked'
  }
}, {
  timestamps: true
});

// Enforce atomic seat lock uniqueness for each show
BookingSeatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('BookingSeat', BookingSeatSchema);
