const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');
const { chkAdmin, chkUserActive } = require('../midds/users');
const { cache, storeObjectInCache, invalidateCache } = require('../midds/cache');

function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /api/v1/products:
   *  post:
   *    summary: Crear producto
   *    description: Permite crear un producto (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un producto.
   *      in: body
   *      required: true
   *      type: string
   *      example: {descripcion: String, precio: Number}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Producto creado
   *      409:
   *        description: Ya existe el producto
   */
  router.post('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const Product = db.getModel('ProductModel');
    const {
      descripcion,
      precio,
    } = req.body;

    // buscar por descripcion
    const current = await Product.findOne({
      where: {
        descripcion,
      },
    });

    // si encuentra, error
    if (current) {
      res
        .status(409)
        .send({ message: 'Ya existe el producto' });
    } else {
      try {
        // crea nuevo producto
        const newProduct = await Product.create({
          descripcion,
          precio,
        });

        // limpio cache
        invalidateCache({
          method: 'GET',
          baseUrl: req.baseUrl,
        });

        // retorna
        res
          .status(200)
          .json(newProduct);
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /api/v1/products:
   *  put:
   *    summary: Actualizar producto
   *    description: Permite editar un producto (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un producto.
   *      in: body
   *      required: true
   *      type: string
   *      example: {id: Number, descripcion: String, precio: Number}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Producto actualizado
   *      404:
   *        description: Producto no encontrado
   *      409:
   *        description: Producto ya existente con esa Descripción
   */
  router.put('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const Product = db.getModel('ProductModel');
    const {
      id,
      descripcion,
      precio,
    } = req.body;

    // buscar por id
    const current = await Product.findOne({
      where: {
        id,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Producto no encontrado' });
    } else {
      // busca desc
      const currDesc = await Product.findOne({
        where: {
          descripcion,
        },
      });

      // si encuentra misma desc  , error
      if (currDesc && currDesc.descripcion !== current.descripcion) {
        res
          .status(409)
          .json({ message: 'Producto ya existente con esa Descripción' });
      } else {
        try {
          // update base
          current.descripcion = descripcion;
          current.precio = precio;
          await current.save();

          // limpio cache
          invalidateCache({
            method: 'GET',
            baseUrl: req.baseUrl,
          });

          res
            .status(200)
            .json(current);
        } catch (error) {
          // si no encuentra, error

          res
            .status(501)
            .json(error);
        }
      }
    }
  });
  /**
   * @swagger
   * /api/v1/products:
   *  delete:
   *    summary: Elimina producto
   *    description: Permite eliminar un producto (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un producto.
   *      in: body
   *      required: true
   *      type: string
   *      example: {id: Number}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Producto eliminado
   *      404:
   *        description: Producto no encontrado
   */
  router.delete('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const Product = db.getModel('ProductModel');
    const {
      id,
    } = req.body;

    // buscar por id
    const current = await Product.findOne({
      where: {
        id,
      },
    });
    // si no encuentra, error
    if (!current) {
      res
        .status(404)
        .json({ message: 'Producto no encontrado' });
    } else {
      try {
        // delete prod
        await current.destroy();

        // limpio cache
        invalidateCache({
          method: 'GET',
          baseUrl: req.baseUrl,
        });

        res
          .status(200)
          .json({ message: 'Producto eliminado' });
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /api/v1/products:
   *  get:
   *    summary: Lista todos los productos
   *    description: Obtener un listado de todos los productos (sólo usuario Admin puede invocar).
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Peticion exitosa
   *
   */
  router.get('/', chkToken, chkAdmin, chkUserActive, cache, async (req, res) => {
    // modelo de datos
    const Product = db.getModel('ProductModel');
    // recupera en DB
    const products = await Product.findAll({});
    // guarda en cache
    storeObjectInCache(req, products);

    res
      .status(200)
      .send(products);
  });

  return router;
}

module.exports = {
  createRouter,
};
