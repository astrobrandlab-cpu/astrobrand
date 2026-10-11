const SupportTicket = require('../models/SupportTicket');

// @desc    Create support ticket
// @route   POST /api/support
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, priority, message } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      category,
      priority,
      messages: [{
        sender: req.user._id,
        senderRole: req.user.role === 'super_admin' ? 'admin' : 'user',
        message
      }]
    });

    res.status(201).json({ success: true, data: ticket, message: 'Support ticket created' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating ticket' });
  }
};

// @desc    Get user tickets
// @route   GET /api/support
exports.getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tickets' });
  }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
exports.getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('messages.sender', 'name avatar role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching ticket' });
  }
};

// @desc    Reply to ticket
// @route   POST /api/support/:id/reply
exports.replyToTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: 'user',
      message: req.body.message
    });

    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      ticket.status = 'open';
    }

    await ticket.save();
    res.status(200).json({ success: true, data: ticket, message: 'Reply sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error replying to ticket' });
  }
};

// @desc    Close ticket
// @route   PUT /api/support/:id/close
exports.closeTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'closed', closedAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.status(200).json({ success: true, data: ticket, message: 'Ticket closed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error closing ticket' });
  }
};
