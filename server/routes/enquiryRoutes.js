const express = require('express');
const { body } = require('express-validator');
const { createEnquiry, listEnquiries, updateEnquiryStatus } = require('../controllers/enquiryController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters.')
], validate, createEnquiry);

router.get('/', authenticate, authorize('admin'), listEnquiries);
router.patch('/:id/status', authenticate, authorize('admin'), [
  body('status').isIn(['New', 'Handled']).withMessage('Status must be New or Handled.')
], validate, updateEnquiryStatus);

module.exports = router;
