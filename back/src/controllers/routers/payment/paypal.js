const express = require('express');
const router = express.Router();
require('dotenv').config();
const paypal = require('@paypal/checkout-server-sdk');
const { chkToken } = require('../../midds/token');
const { chkAdmin, chkUserActive, chkUserAddress } = require('../../midds/users');
const { chkOrderPayment, initPaymentOrder, successPaymentOrder } = require('../../midds/orders');


// Agrega credenciales
// se usa SandboxEnvironment. Para producción, usar LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_SECRET);
let client = new paypal.core.PayPalHttpClient(environment);


// 2) Endpoints de paypal como tal

//2.1. Crea orden de pago
//2.2 Devuelve el link de pago
router.post('/pago', chkToken, chkUserActive, chkOrderPayment, async (req, res) => {

  console.log("New request POST to /pago");

  // datos del pedido en REQ 
  const {
    orderid,
    productos,
    total
  } = req.order;

  // token en REQ 
  const token = req.token;

  // Crea un objeto de preferencia
  let request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    "intent": "CAPTURE",
    "purchase_units": [
      {
        "amount": {
          "currency_code": "USD",
          "value": total
        }
      }
    ],
    "application_context": {
      "return_url": `${process.env.URL_BACK}/paypal/success?tokenapp=${token}`,  // TODO: define this
      "cancel_url": `${process.env.URL_FRONT}/orders.html?token=${token}`,  // TODO: define this
    }
  });

  // Cliente ejecuta 
  client.execute(request).then(response => {
    let { id, links } = response.result;
    console.log(response.result);
    let url = links.filter(link => link.rel == "approve");

    // update pedido con id de pago 
    initPaymentOrder(orderid, id);

    res.status(response.statusCode).json(url.pop());
  }).catch(err => {
    console.error(err);
    res.status(err.statusCode).json(err);
  });
});

router.get('/success', async (req, res) => {
  
  console.log(req.query);
  const {tokenapp, token} = req.query;

  await successPaymentOrder(token);

  const url_front = `${process.env.URL_FRONT}/orders.html?token=${tokenapp}`;

  res.redirect(301, url_front);
});


module.exports = router