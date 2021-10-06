const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Product = sequelize.define('product', {
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    precio: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  }, {
    timestamps: false,
  });

  return Product;
}

module.exports = {
  createModel,
};
