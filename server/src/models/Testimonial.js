const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: 100
  },
  customerPhoto: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial text is required'],
    maxlength: 2000
  },
  service: String,
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

testimonialSchema.index({ user: 1 });
testimonialSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
