const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
    index: true
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
    index: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true,
    index: true
  },
  time: {
    type: String, // e.g. '10:00 AM', '01:30 PM', '07:30 PM'
    required: true
  },
  prices: {
    Standard: { type: Number, required: true, default: 150 },
    Premium: { type: Number, required: true, default: 250 },
    Recliner: { type: Number, required: true, default: 400 }
  },
  bookedSeats: {
    type: [String], // Array of seat designations, e.g., ['A1', 'A2', 'C5']
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// A screen can't host multiple shows at the exact same date and time
ShowSchema.index({ screenId: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Show', ShowSchema);
