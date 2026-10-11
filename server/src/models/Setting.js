const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['platform', 'payment', 'email', 'domain', 'storage', 'seo', 'notification', 'general'],
    default: 'general'
  },
  description: String,
  isSecret: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

settingSchema.index({ category: 1 });

module.exports = mongoose.model('Setting', settingSchema);
