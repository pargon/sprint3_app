const express = require('express');
const passport = require('passport');
const router = express.Router();
const mercadopago = require('mercadopago');
const { passport_connect, passport_callback } = require('./utils');
const strategy_name = 'mp';
const strategy_scope = ['openid email profile'];



// Agrega credenciales
mercadopago.configure({
  access_token: 'TEST-7565162761232394-121423-8930de805f3236f30963ab905fe4c13b-21213031'
});


router.get('/mp/auth', passport.authenticate(strategy_name, { session: false, scope: strategy_scope }));

router.get('/mp/pago', function (req, res, next) {
  console.log("New request GET to /mp/pago");

  // Crea un objeto de preferencia
  let preference = {
    items: [
      {
        title: 'Mi producto',
        unit_price: 100,
        quantity: 1,
      }
    ]
  };

  mercadopago.preferences.create(preference)
    .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      global.id = response.body.id;
    }).catch(function (error) {
      console.log(error);
    });
});

router.post('/mp/pagar', function (req, res, next) {
  console.log("New request POST to /mp/pagar");

  const mp = new MercadoPago('TEST-b1edf423-78cd-4f5a-abe7-168e63e885c8', {
    locale: 'es-AR'
  });

  // Inicializa el checkout
  mp.checkout({
    preference: {
      id: 'YOUR_PREFERENCE_ID'
    },
    render: {
      container: '.cho-container', // Indica el nombre de la clase donde se mostrará el botón de pago
      label: 'Pagaremos', // Cambia el texto del botón de pago (opcional)
    }
  });
});


router.get('/mp/callback', passport.authenticate(strategy_name, { session: false, failureRedirect: '/failed' }),
  function (req, res) {
    /*
    Successful authentication.
    mp correctly authenticated the user and defined the following variables for us:

    req.user : json
      A json object with the mp account data. You can use the req.user._json data.
    req.query.state : string or null
      The user id that we sent to mp to connect our account with the mp account.

    This route is not an API route, it came from the browser redirection,
    so it should redirects to some frontend route.
    */

    console.log("New request GET to /mp/callback");
    const mp_data = req.user._json;
    const user_id = req.query.state;
    const provider_user_id = mp_data.sub;
    const provider_email = mp_data.email;

    console.log(mp_data);

    const token = passport_callback(strategy_name, provider_user_id, provider_email, user_id);

    const url_front = `${process.env.URL_FRONT}/?token=${token}`;

    res.redirect(301, url_front);

  }
);

module.exports = router;