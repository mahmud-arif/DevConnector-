const { check, body } = require('express-validator/check');
const User = require('../models/User');

exports.register = [
  body('name')
    .exists()
    .withMessage('Enter userName'),
  check('name')
    .optional()
    .isAlphanumeric(),
  body('email')
    .exists()
    .withMessage('email address reauired')
    .isEmail()
    .withMessage('please enter a valid email')
    .custom(async (value, { req }) => {
      const user = await User.find({
        email: value,
      });
      return user.length === 0;
    })
    .withMessage('this email already exits')
    .normalizeEmail(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('password required')
    .trim()
    .isLength({
      min: 6,
    })
    .withMessage('password should 6 charecter long'),
];

exports.login = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('password', 'Password has to be valid.')
    .not()
    .isEmpty()
    .withMessage('password required')
    .isLength({
      min: 5,
    })
    .isAlphanumeric()
    .trim(),
];
