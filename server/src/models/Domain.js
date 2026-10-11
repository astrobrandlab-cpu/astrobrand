const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  website: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
    required: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  // Verification
  verificationStatus: {
    type: String,
    enum: ['pending', 'verifying', 'verified', 'failed'],
    default: 'pending'
  },
  verificationToken: String,
  verificationMethod: {
    type: String,
    enum: ['dns_txt', 'dns_cname', 'file'],
    default: 'dns_txt'
  },
  lastVerificationCheck: Date,
  verificationAttempts: { type: Number, default: 0 },
  verifiedAt: Date,

  // DNS Configuration
  dnsStatus: {
    type: String,
    enum: ['pending', 'configured', 'active', 'failed', 'mismatch'],
    default: 'pending'
  },
  dnsRecords: {
    aRecord: {
      configured: { type: Boolean, default: false },
      expectedValue: String,
      actualValue: String,
      lastChecked: Date
    },
    cnameRecord: {
      configured: { type: Boolean, default: false },
      expectedValue: String,
      actualValue: String,
      lastChecked: Date
    }
  },
  lastDnsCheck: Date,

  // SSL
  sslStatus: {
    type: String,
    enum: ['pending', 'provisioning', 'active', 'failed', 'expired'],
    default: 'pending'
  },
  sslProvider: String,
  sslIssuedAt: Date,
  sslExpiresAt: Date,

  // Connection Status
  connectionStatus: {
    type: String,
    enum: ['disconnected', 'pending', 'connected', 'error'],
    default: 'disconnected'
  },

  isPrimary: {
    type: Boolean,
    default: true
  },
  notes: String
}, {
  timestamps: true
});

domainSchema.index({ user: 1 });
domainSchema.index({ website: 1 });
domainSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('Domain', domainSchema);
