const mongoose = require('mongoose');

const TimetableExceptionSchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true,
    index: true
  },
  date: {
    type: String, // "YYYY-MM-DD" representation in UTC/local index string
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['cancel', 'reschedule', 'substitute'],
    required: true
  },
  originalStartTime: {
    type: String // "HH:MM"
  },
  originalEndTime: {
    type: String // "HH:MM"
  },
  newStartTime: {
    type: String // "HH:MM"
  },
  newEndTime: {
    type: String // "HH:MM"
  },
  newRoom: {
    type: String
  },
  substituteTeacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  reason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimetableException', TimetableExceptionSchema);
