const Website = require('../models/Website');
const User = require('../models/User');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get user's website
// @route   GET /api/websites
exports.getWebsite = async (req, res) => {
  try {
    let website = await Website.findOne({ user: req.user._id });
    
    if (!website) {
      // Auto-create website
      const slug = req.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
      website = await Website.create({
        user: req.user._id,
        slug
      });
    }

    res.status(200).json({
      success: true,
      data: website
    });
  } catch (error) {
    console.error('Get website error:', error);
    res.status(500).json({ success: false, message: 'Error fetching website' });
  }
};

// @desc    Update website
// @route   PUT /api/websites
exports.updateWebsite = async (req, res) => {
  try {
    const { sections, seo, appearance, template, config, slug, status } = req.body;
    const updateData = {};

    if (config) updateData.config = config;
    if (slug) updateData.slug = slug.toLowerCase().trim();
    if (status) updateData.status = status;
    if (template) updateData.template = template;

    if (sections) {
      Object.keys(sections).forEach(key => {
        Object.keys(sections[key]).forEach(field => {
          updateData[`sections.${key}.${field}`] = sections[key][field];
        });
      });
    }
    if (seo) {
      Object.keys(seo).forEach(key => {
        updateData[`seo.${key}`] = seo[key];
      });
    }
    if (appearance) {
      Object.keys(appearance).forEach(key => {
        updateData[`appearance.${key}`] = appearance[key];
      });
    }
    updateData.lastUpdated = new Date();

    const website = await Website.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await ActivityLog.create({
      user: req.user._id,
      action: 'website_updated',
      description: 'Website configuration updated',
      targetType: 'Website',
      targetId: website._id
    });

    res.status(200).json({
      success: true,
      data: website,
      message: 'Website updated successfully'
    });
  } catch (error) {
    console.error('Update website error:', error);
    res.status(500).json({ success: false, message: 'Error updating website' });
  }
};

// @desc    Publish website
// @route   POST /api/websites/publish
exports.publishWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate(
      { user: req.user._id },
      {
        status: 'published',
        publishedAt: new Date(),
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    await Notification.create({
      user: req.user._id,
      type: 'website_published',
      title: 'Website Published! 🎉',
      message: 'Your website is now live and accessible to visitors.',
      link: '/dashboard/website'
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'website_published',
      description: 'Website published',
      targetType: 'Website',
      targetId: website._id
    });

    res.status(200).json({
      success: true,
      data: website,
      message: 'Website published successfully!'
    });
  } catch (error) {
    console.error('Publish website error:', error);
    res.status(500).json({ success: false, message: 'Error publishing website' });
  }
};

// @desc    Unpublish website
// @route   POST /api/websites/unpublish
exports.unpublishWebsite = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate(
      { user: req.user._id },
      { status: 'unpublished', lastUpdated: new Date() },
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    await ActivityLog.create({
      user: req.user._id,
      action: 'website_unpublished',
      description: 'Website unpublished',
      targetType: 'Website',
      targetId: website._id
    });

    res.status(200).json({
      success: true,
      data: website,
      message: 'Website unpublished'
    });
  } catch (error) {
    console.error('Unpublish website error:', error);
    res.status(500).json({ success: false, message: 'Error unpublishing website' });
  }
};

// @desc    Get public website by slug
// @route   GET /api/websites/public/:slug
exports.getPublicWebsite = async (req, res) => {
  try {
    const website = await Website.findOne({ slug: req.params.slug });

    if (!website) {
      return res.status(404).json({ success: false, message: 'Website not found' });
    }

    // Increment views safely
    website.views = (website.views || 0) + 1;
    await website.save({ validateBeforeSave: false }).catch(() => {});

    // Get associated data
    let user = null;
    let services = [];
    let testimonials = [];

    if (website.user) {
      [user, services, testimonials] = await Promise.all([
        User.findById(website.user).select('-password -resetPasswordToken -emailVerificationToken'),
        Service.find({ user: website.user, status: 'active' }).sort({ sortOrder: 1 }),
        Testimonial.find({ user: website.user, status: 'active' }).sort({ sortOrder: 1 })
      ]);
    }

    res.status(200).json({
      success: true,
      data: {
        website,
        config: website.config,
        astrologer: user ? {
          name: user.name,
          avatar: user.avatar,
          profile: user.profile,
          phone: user.phone,
          email: user.email
        } : null,
        services,
        testimonials
      }
    });
  } catch (error) {
    console.error('Get public website error:', error);
    res.status(500).json({ success: false, message: 'Error loading website' });
  }
};

// @desc    Submit lead from public website
// @route   POST /api/websites/public/:slug/lead
exports.submitPublicLead = async (req, res) => {
  try {
    const website = await Website.findOne({ slug: req.params.slug });
    let targetUserId = website?.user;

    if (!targetUserId) {
      const defaultUser = await User.findOne();
      targetUserId = defaultUser?._id;
    }

    const lead = await Lead.create({
      user: targetUserId,
      website: website?._id,
      name: req.body.name,
      email: req.body.email || '',
      phone: req.body.phone || '',
      whatsapp: req.body.whatsapp || req.body.phone || '',
      service: req.body.service || '',
      dateOfBirth: req.body.dateOfBirth || '',
      timeOfBirth: req.body.timeOfBirth || '',
      placeOfBirth: req.body.placeOfBirth || '',
      message: req.body.message || '',
      source: 'website',
      status: 'new',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer']
    });

    if (targetUserId) {
      await Notification.create({
        user: targetUserId,
        type: 'lead_received',
        title: 'New Enquiry Received! 📩',
        message: `${req.body.name} has sent you a consultation request.`,
        link: '/dashboard/leads'
      }).catch(err => console.warn('Notification create warning:', err.message));

      await ActivityLog.create({
        user: targetUserId,
        action: 'lead_received',
        description: `New lead from ${req.body.name}`,
        targetType: 'Lead',
        targetId: lead._id
      }).catch(err => console.warn('ActivityLog warning:', err.message));
    }

    res.status(201).json({
      success: true,
      data: lead,
      message: 'Your enquiry has been submitted successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error submitting enquiry' });
  }
};

// @desc    Upload website image
// @route   POST /api/websites/upload
exports.uploadWebsiteImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const filePath = `/uploads/websites/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: { url: filePath },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload website image error:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
};
