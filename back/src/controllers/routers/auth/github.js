const chalk = require('chalk');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { passport_connect, passport_callback } = require('./utils');
const strategy_name = 'github';
const strategy_scope = ['user:email', 'read:user'];

router.get('/github/auth', passport.authenticate(strategy_name, { session: false, scope: strategy_scope }));


router.get('/github/connect', function (req, res, next) {
  /* Connects the current user account with Google. */

  // TODO: This route must be private, implement a middleware to check the authorization.

  console.log("New request GET to /github/connect");

  // We supose that the middleware defines the req.user object
  req.user = { id: 1, }

  passport_connect(strategy_name, strategy_scope, req, res, next);
});

router.get('/github/callback', passport.authenticate(strategy_name, { session: false, failureRedirect: '/failed' }),
  function (req, res) {
    /*
    Successful authentication.
    Google correctly authenticated the user and defined the following variables for us:

    req.user : json
      A json object with the github account data. You can use the req.user._json data.
    req.query.state : string or null
      The user id that we sent to github to connect our account with the Google account.

    This route is not an API route, it came from the browser redirection,
    so it should redirects to some frontend route.
    */

    console.log("New request GET to /github/callback");
    const github_data = req.user._json;
    const user_id = req.query.state;
    const provider_user_id = github_data.id;
    const provider_email = github_data.email;
    const user_name = github_data.name;
    const user_lastname = '';

    console.log(github_data);

    const token = passport_callback(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname);

    const url_front = `${process.env.URL_FRONT}/orders?token=${token}`;

    res.redirect(301, url_front);

  }
);

module.exports = router;