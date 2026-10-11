const express = require('express');
const router = express.Router();
const { getWebsite, updateWebsite, publishWebsite, unpublishWebsite, getPublicWebsite, submitPublicLead, uploadWebsiteImage } = require('../controllers/websiteController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');
const { upload, setUploadDir, handleUploadError } = require('../middlewares/upload');
const { getWebsiteByDomain } = require('../middlewares/customDomain');

// Public routes
router.get('/public/:slug', getPublicWebsite);
router.post('/public/:slug/lead', validate(schemas.createLead), submitPublicLead);

// Custom domain lookup — frontend calls this to get website data by custom domain
// GET /api/websites/by-domain?domain=dr-mehak.com
router.get('/by-domain', getWebsiteByDomain);

// Protected routes
router.use(protect);
router.get('/', getWebsite);
router.put('/', validate(schemas.updateWebsite), updateWebsite);
router.post('/publish', publishWebsite);
router.post('/unpublish', unpublishWebsite);
router.post('/upload', setUploadDir('websites'), upload.single('image'), handleUploadError, uploadWebsiteImage);

module.exports = router;
