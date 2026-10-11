const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  duration: {
    type: String,
    default: '30 Minutes'
  },
  category: {
    type: String,
    enum: [
      'Vedic Astrology', 'Western Astrology', 'Numerology', 'Tarot Reading',
      'Palmistry', 'Vastu Shastra', 'Horoscope', 'Marriage Astrology',
      'Career Astrology', 'Health Astrology', 'Financial Astrology',
      'Gemstone Consultation', 'Kundli Matching', 'Birth Chart Analysis',
      'Annual Prediction', 'Other'
    ],
    default: 'Other'
  },
  image: String,
  icon: String,
  features: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  bookingCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

serviceSchema.index({ user: 1 });
serviceSchema.index({ user: 1, status: 1 });
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
