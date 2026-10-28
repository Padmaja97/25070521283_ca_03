const express = require('express');
const { body } = require('express-validator');
const { applyForMembership, myApplications, allApplications, updateApplicationStatus } = require('../controllers/membershipController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authenticate);
router.post('/', authorize('member'), [
  body('planId').isMongoId().withMessage('Choose a valid membership plan.')
], validate, applyForMembership);
router.get('/my', authorize('member'), myApplications);
router.get('/', authorize('admin'), allApplications);
router.patch('/:id/status', authorize('admin'), [
  body('status').isIn(['Approved', 'Rejected']).withMessage('Status must be Approved or Rejected.'),
  body('startDate').optional({ values: 'falsy' }).isISO8601().withMessage('Start date must be a valid date.')
], validate, updateApplicationStatus);

module.exports = router;
