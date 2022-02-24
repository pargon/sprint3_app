const express = require('express');
const router = express.Router();
const google = require('./google');
const facebook = require('./facebook');
const linkedin = require('./linkedin');
const github = require('./github');
const auth0 = require('./auth0');



/**
 * @swagger
 * /v1/users/failed:
 *  get:
 *    summary: Permite redireccionar en autenticación cuando hay un error 
 *    description:
 *    consumes:
 *    - "application/json"
 *    produces:
 *    - "application/json"
 *    responses:
 *      200:
 *        description: Ok
 */
router.get('/failed', (req, res) => res.send('You Failed to log in!'))

router.use('', google);
router.use('', facebook);
router.use('', linkedin);
router.use('', github);
router.use('', auth0);

module.exports = router
