const express = require('express');
const router = express.Router();
const { listEvents, applyToEvent, createEvent, listMyEvents, getEventSignups } = require('../controllers/events.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', listEvents);
router.post('/', auth, createEvent);
router.post('/:id/apply', auth, applyToEvent);
router.get('/mine', auth, listMyEvents);
router.get('/:id/signups', auth, getEventSignups);

module.exports = router;
