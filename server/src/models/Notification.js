const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'payment_success', 'payment_failed', 'plan_activated', 'plan_expiring',
      'plan_expired', 'domain_verified', 'domain_failed', 'website_published',
      'website_unpublished', 'lead_received', 'subscription_cancelled',
      'profile_update', 'admin_notice', 'system', 'welcome'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: String,
  icon: String,
  isRead: {
    type: Boolean,
    default: false
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
