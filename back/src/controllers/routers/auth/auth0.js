const express = require('express');
const passport = require('passport');
const router = express.Router();
const { passport_connect, passport_callback } = require('./utils');
const strategy_name = 'auth0';
const strategy_scope = ['openid email profile'];

router.get('/auth0/auth', passport.authenticate(strategy_name, { session:false, scope: strategy_scope}));

router.get('/auth0/connect', function (req, res, next) {
  /* Connects the current user account with Auth0. */

  // TODO: This route must be private, implement a middleware to check the authorization.

  console.log("New request GET to /auth0/connect");

  // We supose that the middleware defines the req.user object
  req.user = {id: 1,}

  passport_connect(strategy_name, strategy_scope, req, res, next);
});

router.get('/auth0/callback', passport.authenticate(strategy_name, {  session:false, failureRedirect: '/failed' }),
  function(req, res) {
    /*
    Successful authentication.
    Auth0 correctly authenticated the user and defined the following variables for us:

    req.user : json
      A json object with the auth0 account data. You can use the req.user._json data.
    req.query.state : string or null
      The user id that we sent to auth0 to connect our account with the Auth0 account.

    This route is not an API route, it came from the browser redirection,
    so it should redirects to some frontend route.
    */

    console.log("New request GET to /auth0/callback");
    const auth0_data = req.user._json;
    const user_id = req.query.state;
    const provider_user_id = auth0_data.sub;
    const provider_email = auth0_data.email;

    console.log(auth0_data);

    const token = passport_callback(strategy_name, provider_user_id, provider_email, user_id);

    const url_front = `${process.env.URL_FRONT}/?token=${token}`;

    res.redirect(301, url_front);

  }
);

module.exports = router;