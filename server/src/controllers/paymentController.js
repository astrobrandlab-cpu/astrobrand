const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// Initialize Razorpay conditionally
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id') {
    const Razorpay = require('razorpay');
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (e) {
  console.log('Razorpay not configured - using test mode');
}

// @desc    Get all active plans
// @route   GET /api/plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ status: 'active' }).sort({ sortOrder: 1, price: 1 });
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plans' });
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:slug
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ slug: req.params.slug, status: 'active' });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching plan' });
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/current
exports.getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: { $in: ['active', 'pending'] }
    }).populate('plan').populate('lastPayment');

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active subscription'
      });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching subscription' });
  }
};

// @desc    Create payment order
// @route   POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { planId, planName, planPrice } = req.body;

    let plan;
    if (planId) {
      plan = await Plan.findById(planId);
    } else if (planName) {
      plan = await Plan.findOne({ name: planName });
      if (!plan) {
        const priceNum = parseInt(planPrice.toString().replace(/,/g, '')) || 0;
        plan = await Plan.create({
          name: planName,
          slug: planName.toLowerCase().replace(/ /g, '-'),
          description: 'Custom plan from checkout',
          price: priceNum,
          billingCycle: 'monthly',
          status: 'active',
          features: [],
          limits: { services: 5, testimonials: 10, leads: 100, storage: 50, templates: 1 }
        });
      }
    }

    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    if (plan.price === 0) {
      // Free plan - activate directly
      return activateFreePlan(req, res, plan);
    }

    const amount = plan.price * 100; // Razorpay uses paise

    let order;
    if (razorpay) {
      // Real Razorpay order
      order = await razorpay.orders.create({
        amount,
        currency: plan.currency || 'INR',
        receipt: `order_${req.user._id}_${Date.now()}`,
        notes: {
          userId: req.user._id.toString(),
          planId: plan._id.toString(),
          planName: plan.name
        }
      });
    } else {
      // Test mode order
      order = {
        id: `order_test_${Date.now()}`,
        amount,
        currency: plan.currency || 'INR',
        receipt: `order_${req.user._id}_${Date.now()}`
      };
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      plan: plan._id,
      razorpayOrderId: order.id,
      amount: plan.price,
      currency: plan.currency || 'INR',
      status: 'created'
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'payment_created',
      description: `Payment order created for ${plan.name}: ₹${plan.price}`,
      targetType: 'Payment',
      targetId: payment._id
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
        paymentId: payment._id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'test_key',
        testMode: !razorpay
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating payment order' });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, testMode } = req.body;

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Prevent duplicate processing
    if (payment.status === 'captured') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: payment
      });
    }

    let verified = false;

    if (razorpay && !testMode) {
      // Real Razorpay signature verification
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      verified = expectedSignature === razorpaySignature;
    } else {
      // Test mode - auto verify
      verified = true;
    }

    if (!verified) {
      payment.status = 'failed';
      await payment.save();

      await Notification.create({
        user: req.user._id,
        type: 'payment_failed',
        title: 'Payment Failed',
        message: 'Your payment could not be verified. Please try again or contact support.',
        link: '/dashboard/billing'
      });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment
    payment.razorpayPaymentId = razorpayPaymentId || `pay_test_${Date.now()}`;
    payment.razorpaySignature = razorpaySignature || 'test_signature';
    payment.status = 'captured';
    await payment.save();

    // Activate subscription
    const plan = await Plan.findById(payment.plan);
    
    // Deactivate old subscriptions
    await Subscription.updateMany(
      { user: req.user._id, status: 'active' },
      { status: 'expired' }
    );

    // Calculate end date
    let endDate = new Date();
    switch (plan.billingCycle) {
      case 'monthly': endDate.setMonth(endDate.getMonth() + 1); break;
      case 'quarterly': endDate.setMonth(endDate.getMonth() + 3); break;
      case 'yearly': endDate.setFullYear(endDate.getFullYear() + 1); break;
      case 'lifetime': endDate.setFullYear(endDate.getFullYear() + 99); break;
      default: endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      user: req.user._id,
      plan: plan._id,
      status: 'active',
      startDate: new Date(),
      endDate,
      lastPayment: payment._id,
      currentLimits: plan.limits
    });

    payment.subscription = subscription._id;
    await payment.save();

    // Notifications
    await Notification.create({
      user: req.user._id,
      type: 'payment_success',
      title: 'Payment Successful! 🎉',
      message: `Your ${plan.name} plan has been activated.`,
      link: '/dashboard/billing'
    });

    await Notification.create({
      user: req.user._id,
      type: 'plan_activated',
      title: `${plan.name} Plan Activated`,
      message: `Your ${plan.name} plan is now active until ${endDate.toLocaleDateString()}.`,
      link: '/dashboard/subscription'
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'payment_success',
      description: `Payment successful for ${plan.name}: ₹${payment.amount}`,
      targetType: 'Payment',
      targetId: payment._id,
      ipAddress: req.ip
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'subscription_activated',
      description: `${plan.name} subscription activated`,
      targetType: 'Subscription',
      targetId: subscription._id
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated!',
      data: {
        payment,
        subscription
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('plan', 'name price billingCycle')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment history' });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscriptions/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    }).populate('plan');

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'No active subscription found' });
    }

    if (subscription.plan.price === 0) {
      return res.status(400).json({ success: false, message: 'Cannot cancel free plan' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = req.body.reason || '';
    await subscription.save();

    // Revert to free plan
    const freePlan = await Plan.findOne({ slug: 'free' });
    if (freePlan) {
      await Subscription.create({
        user: req.user._id,
        plan: freePlan._id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        currentLimits: freePlan.limits
      });
    }

    await Notification.create({
      user: req.user._id,
      type: 'subscription_cancelled',
      title: 'Subscription Cancelled',
      message: `Your ${subscription.plan.name} subscription has been cancelled.`,
      link: '/dashboard/billing'
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'subscription_cancelled',
      description: `Subscription cancelled: ${subscription.plan.name}`,
      targetType: 'Subscription',
      targetId: subscription._id
    });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled. You have been moved to the free plan.'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, message: 'Error cancelling subscription' });
  }
};

// @desc    Razorpay webhook
// @route   POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  try {
    // In production, verify webhook signature
    if (razorpay && process.env.RAZORPAY_WEBHOOK_SECRET) {
      const crypto = require('crypto');
      const webhookSignature = req.headers['x-razorpay-signature'];
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (webhookSignature !== expectedSignature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload?.payment?.entity;

    if (!paymentEntity) {
      return res.status(200).json({ success: true, message: 'No payment entity' });
    }

    // Idempotency check
    const existingPayment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
      webhookProcessed: true
    });

    if (existingPayment) {
      return res.status(200).json({ success: true, message: 'Already processed' });
    }

    switch (event) {
      case 'payment.captured': {
        const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (payment && payment.status !== 'captured') {
          payment.razorpayPaymentId = paymentEntity.id;
          payment.status = 'captured';
          payment.paymentMethod = paymentEntity.method;
          payment.gatewayResponse = paymentEntity;
          payment.webhookProcessed = true;
          await payment.save();
        }
        break;
      }
      case 'payment.failed': {
        const payment = await Payment.findOne({ razorpayOrderId: paymentEntity.order_id });
        if (payment) {
          payment.status = 'failed';
          payment.gatewayResponse = paymentEntity;
          payment.webhookProcessed = true;
          await payment.save();
        }
        break;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};

// Helper: Activate free plan
async function activateFreePlan(req, res, plan) {
  await Subscription.updateMany(
    { user: req.user._id, status: 'active' },
    { status: 'expired' }
  );

  const subscription = await Subscription.create({
    user: req.user._id,
    plan: plan._id,
    status: 'active',
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    currentLimits: plan.limits
  });

  res.status(200).json({
    success: true,
    message: 'Free plan activated!',
    data: { subscription }
  });
}
