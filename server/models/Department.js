const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Code must be unique per organization
DepartmentSchema.index({ organizationId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Department', DepartmentSchema);
