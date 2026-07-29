const mongoose = require('mongoose');

const MessageAcknowledgementSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  acknowledgedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can acknowledge a message only once
MessageAcknowledgementSchema.index({ messageId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('MessageAcknowledgement', MessageAcknowledgementSchema);
