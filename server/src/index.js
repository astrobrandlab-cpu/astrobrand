require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const { customDomainMiddleware } = require('./middlewares/customDomain');

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const websites = require('./routes/websites');
const domains = require('./routes/domains');
const services = require('./routes/services');
const testimonials = require('./routes/testimonials');
const leads = require('./routes/leads');
const plans = require('./routes/plans');
const payments = require('./routes/payments');
const subscriptions = require('./routes/subscriptions');
const admin = require('./routes/admin');
const notifications = require('./routes/notifications');
const support = require('./routes/support');

// Connect to database
connectDB();

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading resources like images from other domains if needed
}));

// Prevent XSS attacks
app.use(xss());

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser (except for webhook)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Custom domain resolver — maps dr-mehak.com → her website data
app.use(customDomainMiddleware);

// Static folders
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/websites', websites);
app.use('/api/domains', domains);
app.use('/api/services', services);
app.use('/api/testimonials', testimonials);
app.use('/api/leads', leads);
app.use('/api/plans', plans);
app.use('/api/payments', payments);
app.use('/api/subscriptions', subscriptions);
app.use('/api/admin', admin);
app.use('/api/notifications', notifications);
app.use('/api/support', support);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'AstroBrand API is running' });
});

app.get('/', (req, res) => {
  res.send('AstroBrand API is running...');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
