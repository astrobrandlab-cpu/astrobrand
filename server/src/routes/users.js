const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, updateOnboarding, getDashboard } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const { upload, setUploadDir, handleUploadError } = require('../middlewares/upload');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', validate(schemas.updateProfile), updateProfile);
router.post('/avatar', setUploadDir('avatars'), upload.single('avatar'), handleUploadError, uploadAvatar);
router.put('/onboarding', updateOnboarding);
router.get('/dashboard', getDashboard);

module.exports = router;
