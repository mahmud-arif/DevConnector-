const { body } = require('express-validator/check');
// const Profile = require('../models/profile');
// const User = require('../models/User');

exports.profileInputValidation = [
  body('handle', 'user name is required').exists(),
  body('skills', 'skills are required').exists(),
  body('status', 'status feild required').exists(),
  body('website', 'enter valid Website')
    .optional()
    .isURL(),
  body('youtube', 'enter valid youtube link')
    .optional()
    .isURL(),
  body('twitter', 'enter valid twitter link')
    .optional()
    .isURL(),
  body('linkedIn', 'enter valid linkedIn link')
    .optional()
    .isURL(),
];

exports.experienceValidation = [
  body('title', 'title is required').exists(),
  body('company', 'company is required').exists(),
  body('from', 'From date field is required').exists(),
];

exports.educationValidation = [
  body('school', 'school is feild is required').exists(),
  body('degree', 'Degree field is required').exists(),
  body('feildofstudy', 'Field of study field is required').exists(),
  body('from', 'From date field is required').exists(),
];
