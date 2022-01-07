const express = require('express');
const router = express.Router();
const google = require('./google');
const facebook = require('./facebook');
const linkedin = require('./linkedin');
const github = require('./github');
const auth0 = require('./auth0');



router.post('/login', function(req, res) {

  console.log("New request POST to /login");
  
  console.log(req.body)

  // work with data...

  let data = {
    'success': true,
    'message': `User ${req.body.name} registered correctly`,
    'data': req.body
  }

  res.json(data);
});

router.get('/failed', (req, res) => res.send('You Failed to log in!'))

router.use('', google);
router.use('', facebook);
router.use('', linkedin);
router.use('', github);
router.use('', auth0);

module.exports = router
