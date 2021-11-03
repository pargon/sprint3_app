const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Order = sequelize.define('order', {
    fecha: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    direccion_entrega: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  }, {
    timestamps: false,
  });

  return Order;
}

module.exports = {
  createModel,
};
