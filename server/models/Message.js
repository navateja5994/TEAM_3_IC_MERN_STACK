const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null // System messages
  },
  messageType: {
    type: String,
    enum: ['text', 'voice', 'system'],
    default: 'text'
  },
  text: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  voiceDuration: {
    type: Number,
    default: 0
  },
  scheduledJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScheduledJob',
    unique: true,
    sparse: true, // Only enforces uniqueness for documents where this field is defined
    index: true
  },
  requireAcknowledgement: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
