const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['holiday', 'exam', 'event'],
    default: 'holiday'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Holiday', HolidaySchema);
