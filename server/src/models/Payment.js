const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  // Razorpay fields
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'captured', 'failed', 'refunded', 'disputed'],
    default: 'created'
  },
  paymentMethod: {
    type: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  invoiceId: {
    type: String,
    unique: true,
    sparse: true
  },
  refundId: String,
  refundAmount: Number,
  refundedAt: Date,
  notes: String,
  // Idempotency for webhooks
  webhookProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

paymentSchema.index({ user: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Generate invoice ID
paymentSchema.pre('save', function(next) {
  if (!this.invoiceId) {
    const date = new Date();
    const prefix = 'INV';
    const timestamp = date.getFullYear().toString() + 
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.invoiceId = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
