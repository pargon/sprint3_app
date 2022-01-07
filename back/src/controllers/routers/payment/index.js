const express = require('express');
const router = express.Router();
require('dotenv').config();
const mercadopago = require ('./mercadopago');
const paypal = require ('./paypal');

router.use('/mercadopago',mercadopago);
router.use('/paypal',paypal);

module.exports = router;
