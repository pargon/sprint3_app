const express = require('express');
const passport = require('passport');
const router = express.Router();
const { passport_connect, passport_callback } = require('./utils');
const strategy_name = 'linkedin';
const strategy_scope = ['r_liteprofile', 'r_emailaddress']

/**
 * @swagger
 * /v1/users/linkedin/auth:
 *  get:
 *    tags: 
 *    - "Authentication"  
 *    summary: Autentica mediante el proveedor Linkedin
 *    description:
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: Ok
 */
router.get('/linkedin/auth', passport.authenticate(strategy_name, { session: false, scope: strategy_scope }));

router.get('/linkedin/connect', function (req, res, next) {
  /* Connects the current user account with Google. */

  // TODO: This route must be private, implement a middleware to check the authorization.

  console.log("New request GET to /linkedin/connect");

  // We supose that the middleware defines the req.user object
  req.user = { id: 1, }

  passport_connect(strategy_name, strategy_scope, req, res, next);
});


/**
 * @swagger
 * /v1/users/linkedin/callback:
 *  get:
 *    tags: 
 *    - "Authentication"  
 *    summary: Permite al proveedor redireccionar en caso de autenticación exitosa
 *    description:
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: Ok
 */
router.get('/linkedin/callback', passport.authenticate(strategy_name, { session: false, failureRedirect: '/failed' }),
  async function (req, res) {
    /*
    Successful authentication.
    Google correctly authenticated the user and defined the following variables for us:

    req.user : json
      A json object with the linkedin account data. You can use the req.user._json data.
    req.query.state : string or null
      The user id that we sent to linkedin to connect our account with the Google account.

    This route is not an API route, it came from the browser redirection,
    so it should redirects to some frontend route.
    */

    console.log("New request GET to /linkedin/callback");

    const linkedin_data = req.user._json;
    const user_id = req.query.state;
    const provider_user_id = linkedin_data.id;
    const provider_email = linkedin_data.email;
    const user_name = linkedin_data.firstName.localized.en_US;
    const user_lastname = linkedin_data.lastName.localized.en_US;

    console.log(linkedin_data);

    const token = await passport_callback(strategy_name, provider_user_id, provider_email, user_id, user_name, user_lastname);

    console.log(`token nuevo: ${token}`)

    const url_front = `${process.env.URL_FRONT}/orders.html?token=${token}`;

    res.redirect(301, url_front);
  }
);

module.exports = router;