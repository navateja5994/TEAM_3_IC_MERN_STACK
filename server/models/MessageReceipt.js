const mongoose = require('mongoose');

const MessageReceiptSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['delivered', 'read'],
    default: 'delivered'
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure only one receipt tracking record exists per user per message
MessageReceiptSchema.index({ messageId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('MessageReceipt', MessageReceiptSchema);
