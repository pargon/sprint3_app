const express = require('express');
const { createRouter: createUserRouter } = require('./controllers/routers/users');
const { createRouter: createProductRouter } = require('./controllers/routers/products');
const { createRouter: createPayMethRouter } = require('./controllers/routers/paymeths');
const { createRouter: createOrderRouter } = require('./controllers/routers/orders');
const auth_routes = require('./controllers/routers/auth');
const payment_routes = require('./controllers/routers/payment');
require('./controllers/services');


function makeServer() {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  // endpoints
  server.use('/v1/users', createUserRouter());
  server.use('/v1/products', createProductRouter());
  server.use('/v1/paymeths', createPayMethRouter());
  server.use('/v1/orders', createOrderRouter());
  server.use('/v1/users', auth_routes);
  server.use(payment_routes);


  
  server.get('/', (req, res) => res.render('index', {
    title: 'App Resto',
    message: 'Debe ingresar a las rutas correctas. Docs: /docs',
  }));

  return server;
}

module.exports = {
  makeServer,
};
