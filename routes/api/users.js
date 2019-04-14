const express = require('express');
const { catchErrors } = require('../../Handaler/errorHandaler');
const userController = require('../../controller/user');
const validationController = require('../../validation/user');

const app = express.Router();

app.post(
  '/register',
  validationController.register,
  catchErrors(userController.signup)
);

// login routes

app.post(
  '/login',
  validationController.login,
  catchErrors(userController.login)
);

module.exports = app;
