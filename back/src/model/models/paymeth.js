const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const PayMeth = sequelize.define('paymeth', {
    descripcion: {
      type: DataTypes.STRING(100),
      unique: true,
    },
  }, {
    timestamps: false,
  });
  return PayMeth;
}

module.exports = {
  createModel,
};
