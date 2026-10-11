const Testimonial = require('../models/Testimonial');
const Subscription = require('../models/Subscription');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all testimonials for user
// @route   GET /api/testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ user: req.user._id }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials, count: testimonials.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching testimonials' });
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res) => {
  try {
    // Check plan limits
    const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (subscription) {
      const currentCount = await Testimonial.countDocuments({ user: req.user._id });
      const limit = subscription.currentLimits?.testimonials || 10;
      if (currentCount >= limit) {
        return res.status(403).json({
          success: false,
          message: `You have reached the maximum testimonials (${limit}) on your current plan. Upgrade to add more.`,
          upgradeRequired: true
        });
      }
    }

    const testimonial = await Testimonial.create({ ...req.body, user: req.user._id });

    await ActivityLog.create({
      user: req.user._id,
      action: 'testimonial_created',
      description: `Testimonial added from ${testimonial.customerName}`,
      targetType: 'Testimonial',
      targetId: testimonial._id
    });

    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating testimonial' });
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res) => {
  try {
    let testimonial = await Testimonial.findOne({ _id: req.params.id, user: req.user._id });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: testimonial, message: 'Testimonial updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating testimonial' });
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({ _id: req.params.id, user: req.user._id });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await testimonial.deleteOne();

    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting testimonial' });
  }
};
