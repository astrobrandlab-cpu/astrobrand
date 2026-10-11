const express = require('express');
const router = express.Router();
const { getCurrentSubscription, cancelSubscription } = require('../controllers/paymentController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/current', getCurrentSubscription);
router.post('/cancel', cancelSubscription);

module.exports = router;
