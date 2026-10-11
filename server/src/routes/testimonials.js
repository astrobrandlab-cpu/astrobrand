const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

router.use(protect);

router.route('/')
  .get(getTestimonials)
  .post(validate(schemas.createTestimonial), createTestimonial);

router.route('/:id')
  .put(validate(schemas.createTestimonial), updateTestimonial)
  .delete(deleteTestimonial);

module.exports = router;
