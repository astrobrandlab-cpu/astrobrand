const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website'
  },
  // Lead information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  whatsapp: String,
  message: {
    type: String,
    maxlength: 5000
  },
  service: String,
  // Birth details (for astrology)
  dateOfBirth: String,
  timeOfBirth: String,
  placeOfBirth: String,
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'converted', 'closed'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'phone', 'email', 'referral', 'other'],
    default: 'website'
  },
  notes: String,
  assignedTo: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  // Metadata
  ipAddress: String,
  userAgent: String,
  referrer: String,
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

leadSchema.index({ user: 1 });
leadSchema.index({ user: 1, status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Lead', leadSchema);
