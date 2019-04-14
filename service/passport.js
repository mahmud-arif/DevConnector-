const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRECT;

module.exports = passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    const user = await User.findById({
      _id: jwtPayload.userId,
    });
    if (user) {
      console.log(user);
      return done(null, user);
    }
    return done(null, false);
  })
);
