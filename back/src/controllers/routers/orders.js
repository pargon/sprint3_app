const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');
const { chkAdmin, chkUserActive, chkUserAddress } = require('../midds/users');
const { chkUpdateOrder } = require('../midds/orders');
const chalk = require('chalk');


function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /api/v1/orders:
   *  post:
   *    summary: Nuevo Pedido
   *    description: Permite crear un pedido a un usuario.
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un pedido.
   *      in: body
   *      required: true
   *      type: string
   *      example: {medioPago: String, direccionEntrega: String, detalle: {producto: String, cantidad: Number}}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Pedido creado
   *      403:
   *        description: Dirección no encontrada
   */
  router.post('/', chkToken, chkUserActive, chkUserAddress, async (req, res) => {
    // get modelo
    const Product = db.getModel('ProductModel');
    const Order = db.getModel('OrderModel');
    const {
      medioPago,
      direccionEntrega,
    } = req.body;

    try {
      // setea variables fijas
      const fecha = Date();
      const estado = 'Pendiente';
      const { userid } = req.user;

      // crea registro pedido
      const order = await Order.create({
        fecha,
        paymethDescripcion: medioPago,
        estado,
        direccion_entrega: direccionEntrega,
        userUserid: userid,
      });

      // array de productos
      const detalleProductos = await Promise.all(req.body.detalle.map((elemento) => Product.findOne({
        where: {
          descripcion: elemento.producto,
        },
      })));

      let i = 0;
      for (const { cantidad } of req.body.detalle) {
        // busca producto
        const product = detalleProductos[i];
        if (product) {
          if (cantidad > 0) {
            // agrega detalle tabla
            order.addProduct(product, { through: { cantidad } });
          } else {
            res.status(404).json({ message: 'Cantidad inválida' });
          }
        } else {
          res.status(404).json({ message: 'Producto no encontrado' });
        }

        i += 1;
      }
      // guardo la order
      await order.save();

      // devuelvo ok el endpoint
      res.status(200).json(
        {
          id: order.id,
          message: 'Pedido creado'
        });

    } catch (error) {
      global.console.log(error);
      res.status(406).json(error);
    }
  });
  /**
   * @swagger
   * /api/v1/orders:
   *  put:
   *    summary: Actualiza Pedido
   *    description: Permite editar detalle de un pedido a un usuario.
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un pedido.
   *      in: body
   *      required: true
   *      type: string
   *      example: {id: Number, detalle: {producto: String, cantidad: Number}}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Pedido actualizado
   *      403:
   *        description: Detalle no válido, sólo puede editar o borrar
   *      404:
   *        description: Pedido no encontrado
   *      405:
   *        description: Usuario no es propietario del numero de pedido
   *      406:
   *        description: El Pedido debe estar Pendiente
   */
  router.put('/', chkToken, chkUserActive, chkUpdateOrder, async (req, res) => {
    // get modelo
    const Product = db.getModel('ProductModel');
    const Order = db.getModel('OrderModel');
    const { id, detalle } = req.body;

    try {
      // array de productos
      const order = await Order.findOne({
        where: {
          id,
        },
        include: [Product],
      });

      // lineas del pedido
      order.products.forEach(element => {

        let encontro = false;
        // lineas actualizadas
        detalle.forEach(elementUpd => {
          // mismo producto
          if (element.descripcion === elementUpd.producto) {
            encontro = true;
            // difiere cantidad, update
            if (element.orderproduct.cantidad !== elementUpd.cantidad) {
              // update
              order.removeProduct(element);
              order.addProduct(element, { through: { cantidad: elementUpd.cantidad } });
            }
          }
        });
        if (!encontro) {
          // elimina
          order.removeProduct(element);
        }
      });
      // guardo la order
      await order.save();

      // devuelvo ok el endpoint
      res.status(200).json(
        {
          id: order.id,
          message: 'Pedido Actualizado'
        });

    } catch (error) {
      global.console.log(error);
      res.status(406).json(error);
    }
  });
  /**
   * @swagger
   * /api/v1/orders/all:
   *  get:
   *    summary: Todos los pedidos
   *    description: Obtener un listado con todos los pedidos (sólo usuario Admin puede invocar).
   *    security:
   *    - Bearer: []
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Peticion exitosa
   *      401:
   *        description: Pedido no pertenece al Usuario
   *      403:
   *        description: Invalid Token
   *      404:
   *        description: Pedido no encontrado
   *
   */
  router.get('/all', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    const Order = db.getModel('OrderModel');
    const User = db.getModel('UserModel');
    const Product = db.getModel('ProductModel');
    const PayMeth = db.getModel('PayMethModel');

    const orders = await Order.findAll({ include: [Product, User, PayMeth] });

    res
      .status(200)
      .json(orders);
  });
  return router;
}

module.exports = {
  createRouter,
};
