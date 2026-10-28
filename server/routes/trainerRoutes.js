const express = require('express');
const { body } = require('express-validator');
const { listTrainers, createTrainer, updateTrainer, deleteTrainer } = require('../controllers/catalogController');
const { authenticate, authorize, optionalAuthenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const trainerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('specialization').trim().isLength({ min: 2, max: 100 }).withMessage('Enter a specialization.'),
  body('experience').trim().isLength({ min: 1, max: 80 }).withMessage('Enter experience details.'),
  body('bio').trim().isLength({ min: 10, max: 500 }).withMessage('Biography must be 10–500 characters.'),
  body('image').optional({ values: 'falsy' }).isURL({ protocols: ['https'], require_protocol: true }).withMessage('Trainer image must be an HTTPS URL.'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false.').toBoolean()
];

router.get('/', optionalAuthenticate, listTrainers);
router.post('/', authenticate, authorize('admin'), trainerRules, validate, createTrainer);
router.put('/:id', authenticate, authorize('admin'), trainerRules, validate, updateTrainer);
router.delete('/:id', authenticate, authorize('admin'), deleteTrainer);

module.exports = router;
