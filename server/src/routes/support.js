const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicket, replyToTicket, closeTicket } = require('../controllers/supportController');
const { protect } = require('../middlewares/auth');
const { validate, schemas } = require('../middlewares/validate');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(validate(schemas.createTicket), createTicket);

router.route('/:id')
  .get(getTicket);

router.post('/:id/reply', validate(schemas.replyTicket), replyToTicket);
router.put('/:id/close', closeTicket);

module.exports = router;
