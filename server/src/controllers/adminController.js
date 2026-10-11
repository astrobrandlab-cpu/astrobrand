const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Website = require('../models/Website');
const Domain = require('../models/Domain');
const Lead = require('../models/Lead');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const Setting = require('../models/Setting');

// ========== DASHBOARD ==========

// @desc    Admin dashboard stats
// @route   GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      totalRevenue,
      monthlyRevenue,
      lastMonthRevenue,
      activeSubscriptions,
      expiredSubscriptions,
      pendingPayments,
      publishedWebsites,
      draftWebsites,
      pendingDomains,
      connectedDomains,
      totalLeads,
      totalWebsiteViews,
      openTickets,
      recentUsers,
      recentPayments,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'active' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Payment.aggregate([{ $match: { status: 'captured' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'captured', createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'captured', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'expired' }),
      Payment.countDocuments({ status: { $in: ['created', 'pending'] } }),
      Website.countDocuments({ status: 'published' }),
      Website.countDocuments({ status: 'draft' }),
      Domain.countDocuments({ verificationStatus: 'pending' }),
      Domain.countDocuments({ connectionStatus: 'connected' }),
      Lead.countDocuments(),
      Website.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).select('name email avatar createdAt status'),
      Payment.find({ status: 'captured' }).sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('plan', 'name'),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email')
    ]);

    // Monthly user growth (last 6 months)
    const userGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: start, $lte: end }
      });
      userGrowth.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        users: count
      });
    }

    // Revenue growth (last 6 months)
    const revenueGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const result = await Payment.aggregate([
        { $match: { status: 'captured', createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      revenueGrowth.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: result[0]?.total || 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          newUsersThisMonth,
          userGrowthPercent: newUsersLastMonth ? Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100) : 100,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          revenueGrowthPercent: lastMonthRevenue[0]?.total ? Math.round(((monthlyRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100) : 0,
          activeSubscriptions,
          expiredSubscriptions,
          pendingPayments,
          publishedWebsites,
          draftWebsites,
          pendingDomains,
          connectedDomains,
          totalLeads,
          totalWebsiteViews: totalWebsiteViews[0]?.total || 0,
          openTickets
        },
        charts: { userGrowth, revenueGrowth },
        recentUsers,
        recentPayments,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};

// ========== USERS ==========

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, sort = '-createdAt' } = req.query;
    const query = { role: 'user' };

    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password -resetPasswordToken -emailVerificationToken');

    res.status(200).json({
      success: true,
      data: users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [subscription, website, domain, payments, leads, services, activity] = await Promise.all([
      Subscription.findOne({ user: user._id, status: 'active' }).populate('plan'),
      Website.findOne({ user: user._id }),
      Domain.findOne({ user: user._id }),
      Payment.find({ user: user._id }).sort({ createdAt: -1 }).limit(10).populate('plan', 'name'),
      Lead.countDocuments({ user: user._id }),
      Service.countDocuments({ user: user._id }),
      ActivityLog.find({ user: user._id }).sort({ createdAt: -1 }).limit(20)
    ]);

    res.status(200).json({
      success: true,
      data: { user, subscription, website, domain, payments, leads, services, activity }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // If suspended, also suspend their website
    if (status === 'suspended') {
      await Website.updateOne({ user: user._id }, { status: 'suspended' });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: status === 'suspended' ? 'user_suspended' : 'user_activated',
      description: `User ${status}: ${user.email}`,
      targetType: 'User',
      targetId: user._id,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: user, message: `User ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'super_admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });

    // Clean up all user data
    await Promise.all([
      Website.deleteMany({ user: user._id }),
      Domain.deleteMany({ user: user._id }),
      Service.deleteMany({ user: user._id }),
      Testimonial.deleteMany({ user: user._id }),
      Lead.deleteMany({ user: user._id }),
      Subscription.deleteMany({ user: user._id }),
      Notification.deleteMany({ user: user._id }),
      SupportTicket.deleteMany({ user: user._id })
    ]);

    await user.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'user_deleted',
      description: `User deleted: ${user.email}`,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, message: 'User and all associated data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
};

// ========== PLANS ==========

exports.adminGetPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ sortOrder: 1 });
    // Get subscriber counts
    const plansWithCounts = await Promise.all(plans.map(async (plan) => {
      const subscriberCount = await Subscription.countDocuments({ plan: plan._id, status: 'active' });
      return { ...plan.toObject(), subscriberCount };
    }));
    res.status(200).json({ success: true, data: plansWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_plan_created',
      description: `Plan created: ${plan.name}`,
      targetType: 'Plan',
      targetId: plan._id
    });
    res.status(201).json({ success: true, data: plan, message: 'Plan created' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A plan with this name already exists' });
    }
    res.status(500).json({ success: false, message: 'Error creating plan' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_plan_updated',
      description: `Plan updated: ${plan.name}`,
      targetType: 'Plan',
      targetId: plan._id
    });

    res.status(200).json({ success: true, data: plan, message: 'Plan updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating plan' });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const activeSubscribers = await Subscription.countDocuments({ plan: req.params.id, status: 'active' });
    if (activeSubscribers > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete plan with ${activeSubscribers} active subscribers`
      });
    }

    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });

    res.status(200).json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting plan' });
  }
};

// ========== SUBSCRIPTIONS ==========

exports.adminGetSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const total = await Subscription.countDocuments(query);
    const subscriptions = await Subscription.find(query)
      .populate('user', 'name email avatar')
      .populate('plan', 'name price billingCycle')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subscriptions' });
  }
};

// ========== PAYMENTS ==========

exports.adminGetPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate('plan', 'name price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: payments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payments' });
  }
};

// ========== WEBSITES ==========

exports.adminGetWebsites = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const total = await Website.countDocuments(query);
    const websites = await Website.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: websites,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching websites' });
  }
};

exports.adminUpdateWebsiteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const website = await Website.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!website) return res.status(404).json({ success: false, message: 'Website not found' });
    res.status(200).json({ success: true, data: website, message: `Website ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating website' });
  }
};

// ========== DOMAINS ==========

exports.adminGetDomains = async (req, res) => {
  try {
    const domains = await Domain.find()
      .populate('user', 'name email')
      .populate('website', 'slug status')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: domains });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching domains' });
  }
};

// ========== LEADS ==========

exports.adminGetLeads = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Lead.countDocuments();
    const leads = await Lead.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.status(200).json({
      success: true, data: leads,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leads' });
  }
};

// ========== SUPPORT ==========

exports.adminGetTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const tickets = await SupportTicket.find(query)
      .populate('user', 'name email avatar')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching tickets' });
  }
};

exports.adminReplyTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    ticket.messages.push({
      sender: req.user._id,
      senderRole: 'admin',
      message: req.body.message
    });
    ticket.status = req.body.status || 'in_progress';
    await ticket.save();

    // Notify user
    await Notification.create({
      user: ticket.user,
      type: 'admin_notice',
      title: 'Support Reply',
      message: `Admin replied to your ticket: ${ticket.subject}`,
      link: `/dashboard/support/${ticket._id}`
    });

    res.status(200).json({ success: true, data: ticket, message: 'Reply sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error replying to ticket' });
  }
};

// ========== ACTIVITY LOGS ==========

exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const query = {};
    if (action) query.action = action;

    const total = await ActivityLog.countDocuments(query);
    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true, data: logs,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching activity logs' });
  }
};

// ========== SETTINGS ==========

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsObj = {};
    settings.forEach(s => {
      if (!s.isSecret) {
        settingsObj[s.key] = s.value;
      }
    });
    res.status(200).json({ success: true, data: settingsObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value, category: 'general' },
        { upsert: true, new: true }
      );
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'admin_settings_updated',
      description: `Settings updated: ${Object.keys(updates).join(', ')}`,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating settings' });
  }
};
