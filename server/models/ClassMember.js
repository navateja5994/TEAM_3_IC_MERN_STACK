const mongoose = require('mongoose');

const ClassMemberSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user is added only once per class
ClassMemberSchema.index({ classId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('ClassMember', ClassMemberSchema);
