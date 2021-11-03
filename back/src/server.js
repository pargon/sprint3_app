const express = require('express');
const { createRouter: createUserRouter } = require('./controllers/routers/users');
const { createRouter: createProductRouter } = require('./controllers/routers/products');
const { createRouter: createPayMethRouter } = require('./controllers/routers/paymeths');
const { createRouter: createOrderRouter } = require('./controllers/routers/orders');

function makeServer() {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));

  // endpoints
  server.use('/v1/users', createUserRouter());
  server.use('/v1/products', createProductRouter());
  server.use('/v1/paymeths', createPayMethRouter());
  server.use('/v1/orders', createOrderRouter());
  server.get('/', (req, res) => res.render('index', {
    title: 'App Resto',
    message: 'Debe ingresar a las rutas correctas. Docs: /docs',
  }));

  return server;
}

module.exports = {
  makeServer,
};
