const express = require('express');
const router = express.Router();
const { getPlans, getPlan } = require('../controllers/paymentController');

router.get('/', getPlans);
router.get('/:slug', getPlan);

module.exports = router;
