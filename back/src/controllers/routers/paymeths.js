/* eslint-disable max-len */
const { Router } = require('express');
const db = require('../../model');
const { chkToken } = require('../midds/token');
const { chkAdmin, chkUserActive } = require('../midds/users');

function createRouter() {
  const router = Router();

  /**
   * @swagger
   * /api/v1/paymeths:
   *  post:
   *    summary: Crear medio de pago
   *    description: Permite crear un medio de pago (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un medio de pago.
   *      in: body
   *      required: true
   *      type: string
   *      example: {descripcion: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Medio de Pago creado
   *      409:
   *        description: Ya existe el Medio de Pago
   */
  router.post('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const PayMeth = db.getModel('PayMethModel');
    const {
      descripcion,
    } = req.body;

    // buscar por descripcion
    const current = await PayMeth.findOne({
      where: {
        descripcion,
      },
    });

    // si encuentra, error
    if (current) {
      res
        .status(409)
        .send({ message: 'Ya existe el Medio de Pago' });
    } else {
      try {
        // crea nuevo medio de pago
        const newPayMeth = await PayMeth.create({
          descripcion,
        });

        // retorna
        res
          .status(200)
          .json(newPayMeth);
      } catch (error) {
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /api/v1/paymeths:
   *  put:
   *    summary: Actualiza pedido
   *    description: Permite editar un medio de pago (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un medio de pago.
   *      in: body
   *      required: true
   *      type: string
   *      example: {id: Number, descripcion: String}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Medio de Pago actualizado
   *      404:
   *        description: Medio de Pago no encontrado
   *      409:
   *        description: Ya existe el Medio de Pago con esa Descripción
   */
  router.put('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const PayMeth = db.getModel('PayMethModel');
    const {
      id,
      descripcion,
    } = req.body;

    // buscar por id
    const current = await PayMeth.findOne({
      where: {
        id,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Medio de Pago no encontrado' });
    } else {
      // buscar por descripcion
      const currDesc = await PayMeth.findOne({
        where: {
          descripcion,
        },
      });

      // si encuentra misma desc, error
      if (currDesc) {
        res
          .status(409)
          .json({ message: 'Ya existe el Medio de Pago con esa Descripción' });
      } else {
        try {
          // update base
          current.descripcion = descripcion;
          await current.save();

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
   * /api/v1/paymeths:
   *  delete:
   *    summary: Elimina medio de pago
   *    description: Permite eliminar un medio de pago (sólo usuario Admin).
   *    consumes:
   *    - "application/json"
   *    parameters:
   *    - name: body
   *      description: Cuerpo de un medio de pago.
   *      in: body
   *      required: true
   *      type: string
   *      example: {id: Number}
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Medio de Pago eliminado
   *      404:
   *        description: Medio de Pago no encontrado
   */
  router.delete('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    // get modelo
    const PayMeth = db.getModel('PayMethModel');
    const {
      id,
    } = req.body;

    // buscar por id
    const current = await PayMeth.findOne({
      where: {
        id,
      },
    });
    // si encuentra, actualiza
    if (!current) {
      res
        .status(404)
        .json({ message: 'Medio de Pago no encontrado' });
    } else {
      try {
        // delete medio
        await current.destroy();

        res
          .status(200)
          .json({ message: 'Medio de Pago eliminado' });
      } catch (error) {
        // si no encuentra, error
        res
          .status(501)
          .json(error);
      }
    }
  });
  /**
   * @swagger
   * /api/v1/paymeths:
   *  get:
   *    summary: Lista medios de pago
   *    description: Obtener un listado con todos los medios de pago (sólo usuario Admin puede invocar).
   *    produces:
   *    - "application/json"
   *    responses:
   *      200:
   *        description: Peticion exitosa
   *
   */
  router.get('/', chkToken, chkAdmin, chkUserActive, async (req, res) => {
    const PayMeth = db.getModel('PayMethModel');
    const paymeths = await PayMeth.findAll({});
    res
      .status(200)
      .json(paymeths);
  });

  return router;
}

module.exports = {
  createRouter,
};
