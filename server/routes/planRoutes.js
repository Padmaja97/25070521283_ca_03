const express = require('express');
const { body } = require('express-validator');
const { listPlans, createPlan, updatePlan, deletePlan } = require('../controllers/catalogController');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const planRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Plan name must be 2–80 characters.'),
  body('durationInDays').isInt({ min: 1, max: 3650 }).withMessage('Duration must be between 1 and 3650 days.').toInt(),
  body('price').isFloat({ min: 0, max: 10000000 }).withMessage('Enter a valid price.').toFloat(),
  body('benefits').isArray({ max: 20 }).withMessage('Benefits must be a list of up to 20 items.'),
  body('benefits.*').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Each benefit must be 1–120 characters.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean()
];

router.get('/', optionalAuthenticate, listPlans);
router.post('/', authenticate, authorize('admin'), planRules, validate, createPlan);
router.put('/:id', authenticate, authorize('admin'), planRules, validate, updatePlan);
router.delete('/:id', authenticate, authorize('admin'), deletePlan);

module.exports = router;
