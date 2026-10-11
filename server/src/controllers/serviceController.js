const Service = require('../models/Service');
const Subscription = require('../models/Subscription');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all services for user
// @route   GET /api/services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ user: req.user._id }).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: services, count: services.length });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
};

// @desc    Create service
// @route   POST /api/services
exports.createService = async (req, res) => {
  try {
    // Check plan limits
    const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (subscription) {
      const currentCount = await Service.countDocuments({ user: req.user._id });
      const limit = subscription.currentLimits?.services || 5;
      if (currentCount >= limit) {
        return res.status(403).json({
          success: false,
          message: `You have reached the maximum number of services (${limit}) available on your current plan. Upgrade your plan to add more services.`,
          upgradeRequired: true
        });
      }
    }

    const service = await Service.create({
      ...req.body,
      user: req.user._id
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'service_created',
      description: `Service created: ${service.name}`,
      targetType: 'Service',
      targetId: service._id
    });

    res.status(201).json({ success: true, data: service, message: 'Service created successfully' });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    let service = await Service.findOne({ _id: req.params.id, user: req.user._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await ActivityLog.create({
      user: req.user._id,
      action: 'service_updated',
      description: `Service updated: ${service.name}`,
      targetType: 'Service',
      targetId: service._id
    });

    res.status(200).json({ success: true, data: service, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, user: req.user._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'service_deleted',
      description: `Service deleted: ${service.name}`,
      targetType: 'Service',
      targetId: service._id
    });

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
};

// @desc    Upload service image
// @route   POST /api/services/:id/image
exports.uploadServiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const service = await Service.findOne({ _id: req.params.id, user: req.user._id });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.image = `/uploads/services/${req.file.filename}`;
    await service.save();

    res.status(200).json({ success: true, data: { url: service.image }, message: 'Image uploaded' });
  } catch (error) {
    console.error('Upload service image error:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
};
