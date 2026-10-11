const express = require('express');
const router = express.Router();
const { getDomain, addDomain, verifyDomain, removeDomain } = require('../controllers/domainController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

router.use(protect);

router.route('/')
  .get(getDomain)
  .post(validate(schemas.addDomain), addDomain)
  .delete(removeDomain);

router.post('/verify', verifyDomain);

module.exports = router;
