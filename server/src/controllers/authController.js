const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const Website = require('../models/Website');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Create free subscription
    const freePlan = await Plan.findOne({ slug: 'free', status: 'active' });
    if (freePlan) {
      await Subscription.create({
        user: user._id,
        plan: freePlan._id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        currentLimits: freePlan.limits
      });
    }

    // Create initial website
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    await Website.create({
      user: user._id,
      slug,
      sections: {
        hero: { enabled: true, heading: `Welcome to ${name}'s Astrology`, subheading: 'Unlock the mysteries of the cosmos' },
        about: { enabled: true, content: '' },
        services: { enabled: true },
        testimonials: { enabled: true },
        contact: { enabled: true },
        footer: { enabled: true }
      }
    });

    // Create welcome notification
    await Notification.create({
      user: user._id,
      type: 'welcome',
      title: 'Welcome to AstroBrand! 🌟',
      message: 'Your account has been created. Complete your profile to get started.',
      link: '/dashboard/onboarding'
    });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: 'user_register',
      description: `New user registered: ${email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating account. Please try again.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check status
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: user.role === 'super_admin' ? 'admin_login' : 'user_login',
      description: `User logged in: ${email}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.'
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscription = await Subscription.findOne({ 
      user: req.user._id, 
      status: 'active' 
    }).populate('plan');

    // Calculate profile completion
    const profileCompletion = user.calculateProfileCompletion();
    
    res.status(200).json({
      success: true,
      data: {
        user,
        subscription,
        profileCompletion
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      });
    }

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // In production, send email here
    console.log('Reset URL:', resetUrl);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
      // Include token in dev mode for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing request'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await ActivityLog.create({
      user: user._id,
      action: 'password_reset',
      description: 'Password reset successfully',
      ipAddress: req.ip
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    await ActivityLog.create({
      user: user._id,
      action: 'password_changed',
      description: 'Password changed',
      ipAddress: req.ip
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Update password error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating password'
    });
  }
};

// Helper: Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
    status: user.status
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userData
    });
};
