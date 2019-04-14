const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { name, email, password } = req.body;
  const hashpwd = await bcrypt.hash(password, 12);
  const avatar = gravatar.url(email, {
    s: 200,
    r: 'pg',
    d: 'mm',
  });
  const user = new User({
    name,
    email,
    password: hashpwd,
    avatar,
  });
  const result = await user.save();
  await res.json({
    name: result.name,
    email: result.email,
    avatar: result.avatar,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    const error = new Error('A user with this email could not be found.');
    error.statusCode = 401;
    throw error;
  }
  const loadedUser = user;

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error('Wrong password!');
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign(
    {
      email: loadedUser.email,
      userId: loadedUser._id.toString(),
      avatar: loadedUser.avater,
    },
    process.env.SECRECT,
    {
      expiresIn: '1h',
    }
  );
  res.status(200).json({
    token: `Bearer ${token}`,
    userId: loadedUser._id.toString(),
  });
};
