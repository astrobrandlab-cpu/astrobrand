const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: String,
    unique: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['billing', 'technical', 'domain', 'website', 'account', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'],
    default: 'open'
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    message: {
      type: String,
      required: true,
      maxlength: 5000
    },
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  closedAt: Date
}, {
  timestamps: true
});

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });

supportTicketSchema.pre('save', function(next) {
  if (!this.ticketId) {
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    this.ticketId = `TKT-${random}`;
  }
  next();
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
