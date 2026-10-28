const express = require('express');
const { body } = require('express-validator');
const { register, login, currentUser, updateProfile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();
const emailRule = body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail();

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  emailRule,
  body('password').isString().isLength({ min: 8, max: 72 }).withMessage('Password must be 8–72 characters.'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.')
], validate, register);

router.post('/login', [
  emailRule,
  body('password').isString().notEmpty().withMessage('Password is required.')
], validate, login);

router.get('/me', authenticate, currentUser);
router.patch('/me', authenticate, [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone number must be 20 characters or fewer.')
], validate, updateProfile);

module.exports = router;
