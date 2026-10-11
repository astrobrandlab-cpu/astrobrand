const express = require('express');
const router = express.Router();
const { getLeads, getLead, updateLead, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.route('/')
  .get(getLeads);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
