const mongoose = require('mongoose');

const ScheduledJobSchema = new mongoose.Schema({
  jobType: {
    type: String,
    enum: ['message', 'notification', 'reminder'],
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true,
    index: true
  },
  recurrenceRule: {
    type: String, // 'daily', 'weekly', 'cron', etc.
    default: ''
  },
  status: {
    type: String,
    enum: ['scheduled', 'processing', 'completed', 'failed'],
    default: 'scheduled',
    index: true
  },
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },
  nextAttemptAt: {
    type: Date,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Job payload details
    default: {}
  },
  error: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScheduledJob', ScheduledJobSchema);
