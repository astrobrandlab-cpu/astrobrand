require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Setting = require('../models/Setting');

const { MongoMemoryServer } = require('mongodb-memory-server');

// Connect to DB
const connectDb = async () => {
  let uri = process.env.MONGODB_URI;
  if (uri === 'mongodb://localhost:27017/astrobrand' || !uri) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB');
    } catch (e) {
      console.log('Falling back to memory server...');
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      await mongoose.connect(uri);
    }
  } else {
    await mongoose.connect(uri);
  }
};

const seedData = async () => {
  try {
    await connectDb();
    console.log('Seeding data...');

    // 1. Create Super Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@astrobrand.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'super_admin',
        isEmailVerified: true,
        onboardingCompleted: true
      });
      console.log('Super Admin created');
    }

    // 2. Create Default Plans
    const plansCount = await Plan.countDocuments();
    
    if (plansCount === 0) {
      const plans = [
        {
          name: 'Free',
          slug: 'free',
          description: 'Basic features to get started',
          price: 0,
          billingCycle: 'monthly',
          features: [
            { name: '1 Website Template', included: true },
            { name: 'Basic Astrology Services', included: true },
            { name: 'Up to 5 Services', included: true },
            { name: 'Up to 10 Testimonials', included: true },
            { name: 'Basic Enquiries (100/mo)', included: true },
            { name: 'Custom Domain', included: false },
            { name: 'Premium Templates', included: false }
          ],
          limits: {
            services: 5,
            testimonials: 10,
            leads: 100,
            storage: 50,
            templates: 1,
            customDomain: false
          },
          status: 'active',
          sortOrder: 1
        },
        {
          name: 'Professional',
          slug: 'professional',
          description: 'For growing astrology practices',
          price: 999,
          billingCycle: 'monthly',
          features: [
            { name: 'All Premium Templates', included: true },
            { name: 'Unlimited Services', included: true },
            { name: 'Unlimited Testimonials', included: true },
            { name: 'Unlimited Enquiries', included: true },
            { name: 'Custom Domain Support', included: true },
            { name: 'Priority Support', included: true },
            { name: 'Advanced Analytics', included: true }
          ],
          limits: {
            services: 100,
            testimonials: 1000,
            leads: 10000,
            storage: 500,
            templates: 5,
            customDomain: true,
            analytics: true,
            prioritySupport: true
          },
          isPopular: true,
          status: 'active',
          sortOrder: 2
        }
      ];

      await Plan.insertMany(plans);
      console.log('Default plans created');
    }

    // 3. Create Default Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      const settings = [
        { key: 'platform_name', value: 'AstroBrand', category: 'platform' },
        { key: 'support_email', value: 'support@astrobrand.com', category: 'platform' },
        { key: 'currency_symbol', value: '₹', category: 'payment' },
        { key: 'currency_code', value: 'INR', category: 'payment' }
      ];
      await Setting.insertMany(settings);
      console.log('Default settings created');
    }

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
