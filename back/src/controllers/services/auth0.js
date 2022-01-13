const passport = require('passport');
const auth0Strategy = require('passport-auth0').Strategy;
require('dotenv').config()

const strategy_name = 'auth0';

passport.use(strategy_name, new auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK,
    state: false
  },
  
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    
    return done(null, profile);
  }

));
