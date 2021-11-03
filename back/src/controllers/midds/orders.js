const chalk = require('chalk');
const { enc } = require('crypto-js');
const db = require('../../model');

async function chkUpdateOrder(req, res, next) {

  // modeloS
  const Order = db.getModel('OrderModel');
  const Product = db.getModel('ProductModel');

  // variables
  const { id } = req.body;
  const { userid } = req.user;

  // busca order por id
  const current = await Order.findOne({
    where: {
      id
    },
    include: [
      Product
    ],
  });

  // encontro order
  if (current) {

    // usuario order es el mismo del token
    if (current.userUserid === userid) {

      // estado order valido
      if (current.estado === 'Pendiente') {

        const { detalle } = req.body;
        const { products } = current;
        if (chkUpdateOrderDetail(products, detalle)) {
          next();
        } else {
          res
            .status(403)
            .json({
              message: 'Detalle no válido, sólo puede editar o borrar'
            });
        }
      } else {
        res
          .status(406)
          .json({
            message: 'El Pedido debe estar Pendiente'
          });
      }
    } else {
      res
        .status(401)
        .json({
          message: 'Pedido no pertenece al Usuario'
        });
    }
  } else {
    res
      .status(404)
      .json({
        message: 'Pedido no encontrado'
      });
  }
}

function chkUpdateOrderDetail(products, detalle) {
  let detalleExiste = true;

  // por cada producto en detalle
  detalle.forEach(detElement => {
    let encontro = false;

    // compara con producto en order
    products.forEach(prdElement => {
      // encontro
      if (detElement.producto === prdElement.descripcion) {
        encontro = true;
        return true
      }
    });
    if (!encontro) {
      detalleExiste = false;
      return false;
    }
  });
  return detalleExiste;
}

module.exports = {
  chkUpdateOrder,
};
