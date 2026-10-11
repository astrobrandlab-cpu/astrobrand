const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: { success: false, message: 'Too many attempts. Please try again after 15 minutes.' }
});

router.post('/register', authLimiter, validate(schemas.register), register);
router.post('/login', authLimiter, validate(schemas.login), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', authLimiter, validate(schemas.forgotPassword), forgotPassword);
router.put('/reset-password/:token', validate(schemas.resetPassword), resetPassword);
router.put('/update-password', protect, updatePassword);

module.exports = router;
