const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'lifetime', 'free'],
    required: true
  },
  features: [{
    name: String,
    included: { type: Boolean, default: true },
    description: String
  }],
  limits: {
    services: { type: Number, default: 5 },
    testimonials: { type: Number, default: 10 },
    leads: { type: Number, default: 100 },
    storage: { type: Number, default: 100 }, // MB
    templates: { type: Number, default: 1 },
    galleryImages: { type: Number, default: 10 },
    customDomain: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    seoTools: { type: Boolean, default: false },
    removeBranding: { type: Boolean, default: false }
  },
  badge: {
    type: String,
    default: ''
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

planSchema.index({ slug: 1 });
planSchema.index({ status: 1, sortOrder: 1 });

planSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Plan', planSchema);
