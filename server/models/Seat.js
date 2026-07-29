const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
    index: true
  },
  row: {
    type: String, // e.g. 'A', 'B'
    required: true,
    trim: true
  },
  number: {
    type: Number, // e.g. 1, 2, 3
    required: true
  },
  category: {
    type: String,
    enum: ['Standard', 'Premium', 'Recliner'],
    default: 'Standard'
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness of seat per row/number in a screen
SeatSchema.index({ screenId: 1, row: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema);
