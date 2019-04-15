const { validationResult } = require('express-validator/check');
const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  const errors = {};
  const profile = await Profile.findOne({
    user: req.user.id,
  }).populate('user', ['name', 'avatar']);
  if (!profile) {
    errors.noprofile = 'There is no profile for this user';
    return res.status(404).json(errors);
  }
  res.json(profile);
};

exports.postProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  // Skills - Spilt into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  const profile = await Profile.findOne({
    user: req.user.id,
  });
  if (profile) {
    const profilee = await Profile.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $set: profileFields,
      },
      {
        new: true,
      }
    );
    return res.json(profilee);
  }
  const profileee = await Profile.findOneAndUpdate({
    handle: profileFields.handle,
  });
  if (profileee) {
    errors.handle = 'That handle already exists';
    res.status(400).json(errors);
  }
  await new Profile(profileFields).save().then(proFile => res.json(proFile));
};

exports.addExperience = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const profile = await Profile.findOne({
    user: req.user.id,
  });
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  const exp = await profile.experience.unshift(newExp);

  await exp.save().then(profilee => res.json(profilee));
};

exports.addEducation = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const profile = await Profile.findOne({
    user: req.user.id,
  });
  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to,
    current: req.body.current,
    description: req.body.description,
  };
  // Add to exp array
  profile.education.unshift(newEdu);
  await profile.save().then(profilee => res.json(profilee));
};
