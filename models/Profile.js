const mongoose = require('mongoose');
const User = require('./User');

const Schem = mongoose.Schema;

const profileSchema = new Schem({
  user: {
    type: Schem.Types.ObjectId,
    ref: 'User',
  },
  handle: {
    type: String,
    required: true,
    max: 30,
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },

  location: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', profileSchema);
