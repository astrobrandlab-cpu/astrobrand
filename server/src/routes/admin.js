const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

router.use(protect);
router.use(authorize('super_admin', 'admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Plans
router.route('/plans')
  .get(adminController.adminGetPlans)
  .post(validate(schemas.createPlan), adminController.createPlan);

router.route('/plans/:id')
  .put(validate(schemas.createPlan), adminController.updatePlan)
  .delete(adminController.deletePlan);

// Subscriptions & Payments
router.get('/subscriptions', adminController.adminGetSubscriptions);
router.get('/payments', adminController.adminGetPayments);

// Websites & Domains
router.get('/websites', adminController.adminGetWebsites);
router.put('/websites/:id/status', adminController.adminUpdateWebsiteStatus);
router.get('/domains', adminController.adminGetDomains);

// Leads & Support
router.get('/leads', adminController.adminGetLeads);
router.get('/tickets', adminController.adminGetTickets);
router.post('/tickets/:id/reply', validate(schemas.replyTicket), adminController.adminReplyTicket);

// Logs & Settings
router.get('/logs', adminController.getActivityLogs);
router.route('/settings')
  .get(adminController.getSettings)
  .put(adminController.updateSettings);

module.exports = router;
