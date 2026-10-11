const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired', 'cancelled', 'suspended'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  cancelledAt: Date,
  cancelReason: String,
  // Payment reference
  lastPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  // Cached plan limits for quick access
  currentLimits: {
    services: Number,
    testimonials: Number,
    leads: Number,
    storage: Number,
    templates: Number,
    galleryImages: Number,
    customDomain: Boolean,
    analytics: Boolean,
    prioritySupport: Boolean,
    seoTools: Boolean,
    removeBranding: Boolean
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ user: 1, status: 1 });

// Check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Check if near expiry (within 7 days)
subscriptionSchema.methods.isNearExpiry = function() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  return this.endDate <= sevenDaysFromNow && this.endDate > new Date();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
