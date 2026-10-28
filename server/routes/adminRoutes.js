const express = require('express');
const { body } = require('express-validator');
const { dashboard, members, getSettings, updateSettings } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authenticate, authorize('admin'));
router.get('/dashboard', dashboard);
router.get('/members', members);
router.get('/settings', getSettings);
router.put('/settings', [
  body('location').trim().isLength({ min: 5, max: 160 }).withMessage('Location must be 5–160 characters.'),
  body('openingHours').trim().isLength({ min: 1, max: 500 }).withMessage('Enter opening hours or a contact note.')
], validate, updateSettings);

module.exports = router;
