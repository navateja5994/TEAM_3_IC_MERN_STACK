const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  type: {
    type: String, // e.g. 'Dolby Atmos', 'Premium', 'IMAX 3D', '4DX'
    required: true,
    trim: true
  },
  rows: {
    type: Number, // Number of rows, e.g. 10 (representing A to J)
    required: true
  },
  cols: {
    type: Number, // Number of seats per row, e.g. 12
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Screen', ScreenSchema);
