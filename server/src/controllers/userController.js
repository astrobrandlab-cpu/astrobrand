const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Website = require('../models/Website');
const ActivityLog = require('../models/ActivityLog');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    }).populate('plan');
    const website = await Website.findOne({ user: req.user._id });

    const profileCompletion = user.calculateProfileCompletion();

    res.status(200).json({
      success: true,
      data: {
        user,
        subscription,
        website: website ? { status: website.status, slug: website.slug } : null,
        profileCompletion
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Don't allow role/status changes through this endpoint
    delete updateData.role;
    delete updateData.status;
    delete updateData.email;
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Recalculate profile completion
    user.profileCompletion = user.calculateProfileCompletion();
    await user.save({ validateBeforeSave: false });

    await ActivityLog.create({
      user: req.user._id,
      action: 'user_update_profile',
      description: 'Profile updated',
      ipAddress: req.ip
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const filePath = `/uploads/avatars/${req.file.filename}`;
    
    await User.findByIdAndUpdate(req.user._id, { avatar: filePath });

    res.status(200).json({
      success: true,
      data: { url: filePath },
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ success: false, message: 'Error uploading avatar' });
  }
};

// @desc    Update onboarding step
// @route   PUT /api/users/onboarding
exports.updateOnboarding = async (req, res) => {
  try {
    const { step, completed, data } = req.body;

    const updateObj = {};
    if (step !== undefined) updateObj.onboardingStep = step;
    if (completed !== undefined) updateObj.onboardingCompleted = completed;

    // If data is provided, merge with profile
    if (data) {
      if (data.profile) {
        Object.keys(data.profile).forEach(key => {
          updateObj[`profile.${key}`] = data.profile[key];
        });
      }
      if (data.name) updateObj.name = data.name;
      if (data.phone) updateObj.phone = data.phone;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateObj },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
      message: 'Onboarding progress saved'
    });
  } catch (error) {
    console.error('Update onboarding error:', error);
    res.status(500).json({ success: false, message: 'Error updating onboarding' });
  }
};

// @desc    Get dashboard data
// @route   GET /api/users/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [user, subscription, website] = await Promise.all([
      User.findById(userId),
      Subscription.findOne({ user: userId, status: 'active' }).populate('plan'),
      Website.findOne({ user: userId })
    ]);

    const Lead = require('../models/Lead');
    const Domain = require('../models/Domain');
    const Service = require('../models/Service');
    const Notification = require('../models/Notification');

    const [
      totalLeads,
      newLeads,
      recentLeads,
      domain,
      serviceCount,
      unreadNotifications
    ] = await Promise.all([
      Lead.countDocuments({ user: userId }),
      Lead.countDocuments({ user: userId, status: 'new' }),
      Lead.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
      Domain.findOne({ user: userId }),
      Service.countDocuments({ user: userId, status: 'active' }),
      Notification.countDocuments({ user: userId, isRead: false })
    ]);

    const profileCompletion = user.calculateProfileCompletion();

    res.status(200).json({
      success: true,
      data: {
        profileCompletion,
        website: website ? {
          status: website.status,
          views: website.views,
          slug: website.slug,
          template: website.template,
          publishedAt: website.publishedAt,
          lastUpdated: website.updatedAt
        } : null,
        subscription: subscription ? {
          plan: subscription.plan?.name,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          limits: subscription.currentLimits
        } : null,
        domain: domain ? {
          domain: domain.domain,
          verificationStatus: domain.verificationStatus,
          dnsStatus: domain.dnsStatus,
          sslStatus: domain.sslStatus,
          connectionStatus: domain.connectionStatus
        } : null,
        leads: {
          total: totalLeads,
          new: newLeads,
          recent: recentLeads
        },
        services: serviceCount,
        unreadNotifications,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard data' });
  }
};
