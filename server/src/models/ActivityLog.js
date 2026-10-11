const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_register', 'user_login', 'user_logout', 'user_update_profile',
      'user_suspended', 'user_activated', 'user_deleted',
      'plan_purchase', 'plan_upgrade', 'plan_downgrade', 'plan_cancel',
      'payment_created', 'payment_success', 'payment_failed', 'payment_refund',
      'subscription_activated', 'subscription_expired', 'subscription_cancelled',
      'website_created', 'website_updated', 'website_published', 'website_unpublished',
      'domain_added', 'domain_verified', 'domain_connected', 'domain_removed',
      'service_created', 'service_updated', 'service_deleted',
      'testimonial_created', 'testimonial_updated', 'testimonial_deleted',
      'lead_received', 'lead_updated',
      'admin_login', 'admin_action', 'admin_plan_created', 'admin_plan_updated',
      'admin_settings_updated', 'password_reset', 'password_changed'
    ]
  },
  description: String,
  metadata: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  targetType: String,
  targetId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
});

activityLogSchema.index({ user: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
