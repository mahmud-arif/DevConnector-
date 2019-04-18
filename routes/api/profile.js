const express = require('express');
const passport = require('passport');
const { catchErrors } = require('../../Handaler/errorHandaler');
const profileController = require('../../controller/profile');
const validationController = require('../../validation/profile');

const app = express.Router();
// const Profile = require('../../models/profile');
// const User = require('../../models/User');

app.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  catchErrors(profileController.getProfile)
);
app.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  validationController.profileInputValidation,
  catchErrors(profileController.postProfile)
);

app.post(
  '/experience',
  passport.authenticate('jwt', {
    session: false,
  }),
  validationController.experienceValidation,
  catchErrors(profileController.addExperience)
);

app.post(
  '/education',
  passport.authenticate('jwt', {
    session: false,
  }),
  validationController.educationValidation,
  catchErrors(profileController.addEducation)
);
app.get('/test', (req, res) => {
  res.send('success');
});

module.exports = app;
