const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
require('dotenv').config()

const strategy_name = 'github';

passport.use(strategy_name, new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
