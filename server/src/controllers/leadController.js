const Lead = require('../models/Lead');

// @desc    Get all leads for user
// @route   GET /api/leads
exports.getLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = { user: req.user._id };
    
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Stats
    const stats = await Lead.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = {};
    stats.forEach(s => { statusCounts[s._id] = s.count; });

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      stats: statusCounts
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: 'Error fetching leads' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Mark as read
    if (!lead.isRead) {
      lead.isRead = true;
      await lead.save();
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching lead' });
  }
};

// @desc    Update lead status
// @route   PUT /api/leads/:id
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const { status, notes, priority } = req.body;
    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    if (priority) lead.priority = priority;
    await lead.save();

    res.status(200).json({ success: true, data: lead, message: 'Lead updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating lead' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting lead' });
  }
};
