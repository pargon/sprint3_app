const express = require('express');
const router = express.Router();
require('dotenv').config();
const mercadopago = require('mercadopago');
const { chkToken } = require('../../midds/token');
const { chkAdmin, chkUserActive, chkUserAddress } = require('../../midds/users');
const { chkOrderPayment, initPaymentOrder, successPaymentOrder } = require('../../midds/orders');

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_TOKEN
});

router.post('/pago', chkToken, chkUserActive, chkOrderPayment, async (req, res) => {
  console.log("New request POST to /pago");

  // datos del usuario en REQ 
  const {
    userid,
    nombre,
    apellido,
    mail
  } = req.userdata;

  // datos del pedido en REQ 
  const {
    orderid,
    productos,
    total
  } = req.order;

  // token en REQ 
  const token = req.token;

  // usuario logueado
  const user = {
    "name": nombre || userid,
    "last_name": apellido || userid,
    "email": mail || userid,
  }

  let items = [
    {
      title: 'Pedido',
      unit_price: total,
      quantity: 1,
    }
  ]

  // Crea un objeto de preferencia
  let preference = {
    "auto_return": "approved",
    "back_urls": {
      "success": `${process.env.URL_BACK}/mercadopago/success?token=${token}`,  // TODO: define this
      "failure": `${process.env.URL_FRONT}/orders.html?token=${token}`,  // TODO: define this
      "pending": `${process.env.URL_FRONT}/orders.html?token=${token}`   // TODO: define this
    },
    "payer": {
      "name": user.name,
      "surname": user.last_name,
      "email": user.email,
    },
    items: items
  };

  // petición a mercado pago para preparar la compra
  mercadopago.preferences.create(preference)
    .then(function (response) {
      // Ok, haga el proceso de pago con este id:
      console.log(response)
      let id = response.body.id;

      // update pedido con id de pago 
      initPaymentOrder(orderid, id);

      res.json({ "preference_id": id, 'url': response.body.sandbox_init_point });
    }).catch(function (error) {
      console.log(error);
    });
});

router.get('/success', async (req, res) => {
  
  console.log(req.query);
  const {token} = req.query;
  const {preference_id} = req.query;

  await successPaymentOrder(preference_id);

  const url_front = `${process.env.URL_FRONT}/orders.html?token=${token}`;

  res.redirect(301, url_front);
});




module.exports = router