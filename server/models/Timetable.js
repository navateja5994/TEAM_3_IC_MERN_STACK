const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  room: {
    type: String,
    required: true,
    trim: true
  },
  dayOfWeek: {
    type: Number, // 0 = Sunday, 1 = Monday, etc.
    required: true,
    min: 0,
    max: 6
  },
  startTime: {
    type: String, // "HH:MM", e.g., "09:00"
    required: true,
    trim: true
  },
  endTime: {
    type: String, // "HH:MM", e.g., "10:00"
    required: true,
    trim: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  semesterStart: {
    type: Date,
    required: true
  },
  semesterEnd: {
    type: Date,
    required: true
  },
  isPaused: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', TimetableSchema);
