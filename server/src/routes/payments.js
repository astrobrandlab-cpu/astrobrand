const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getPaymentHistory, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

// Webhook must be public and handle raw body in production (handled in index.js)
router.post('/webhook', handleWebhook);

router.use(protect);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

module.exports = router;
