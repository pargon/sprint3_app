const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Provider = sequelize.define('providers', {
    providerid: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  });
  return Provider;
}

module.exports = {
  createModel,
};
