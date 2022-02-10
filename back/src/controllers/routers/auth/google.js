const chalk = require('chalk');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { passport_connect, passport_callback } = require('./utils');
const strategy_name = 'google';
const strategy_scope = ['profile', 'email'];

router.get('/google/auth', passport.authenticate(strategy_name, { session:false, scope: strategy_scope}));

router.get('/google/connect', function (req, res, next) {
  /* Connects the current user account with Google. */

  // TODO: This route must be private, implement a middleware to check the authorization.

  console.log("New request GET to /google/connect");

  // We supose that the middleware defines the req.user object
  req.user = {id: 1,}

  passport_connect(strategy_name, strategy_scope, req, res, next);

});

router.get('/google/callback', passport.authenticate(strategy_name, {  session:false, failureRedirect: '/failed' }),
  async function(req, res) {
    /*
    Successful authentication.
    Google correctly authenticated the user and defined the following variables for us:

    req.user : json
      A json object with the google account data. You can use the req.user._json data.
    req.query.state : string or null
      The user id that we sent to google to connect our account with the Google account.

    This route is not an API route, it came from the browser redirection,
    so it should redirects to some frontend route.
    */

    console.log("New request GET to /google/callback");

    const google_data = req.user._json;
    const user_id = req.query.state;
    const provider_user_id = google_data.sub;
    const provider_email = google_data.email;
    const user_name = google_data.given_name;
    const user_lastname = google_data.family_name;
    
    console.log(google_data);

    const token = await passport_callback(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname);
    
    console.log(`token nuevo: ${token}`)

    const url_front = `${process.env.URL_FRONT}/orders.html?token=${token}`;

    res.header( 'x-authorization', `Bearer ${token}` );
    res.redirect(301, url_front);

  }
);

module.exports = router;