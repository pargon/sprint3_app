const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config()

const strategy_name = 'facebook';

passport.use(strategy_name, new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'emails', 'name'],
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
