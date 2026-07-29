const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['web', 'android', 'ios'],
    default: 'web'
  }
}, {
  timestamps: true
});

// Ensure a token is only registered once per user
DeviceSchema.index({ userId: 1, token: 1 }, { unique: true });

module.exports = mongoose.model('Device', DeviceSchema);
