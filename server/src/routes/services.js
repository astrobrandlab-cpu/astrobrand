const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService, uploadServiceImage } = require('../controllers/serviceController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const { upload, setUploadDir, handleUploadError } = require('../middlewares/upload');

router.use(protect);

router.route('/')
  .get(getServices)
  .post(validate(schemas.createService), createService);

router.route('/:id')
  .put(validate(schemas.createService), updateService)
  .delete(deleteService);

router.post('/:id/image', setUploadDir('services'), upload.single('image'), handleUploadError, uploadServiceImage);

module.exports = router;
