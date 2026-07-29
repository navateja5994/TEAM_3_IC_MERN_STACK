const mongoose = require('mongoose');

const BlockedUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  blockedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Avoid duplicate blocks
BlockedUserSchema.index({ userId: 1, blockedUserId: 1 }, { unique: true });

module.exports = mongoose.model('BlockedUser', BlockedUserSchema);
