const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const User = sequelize.define('user', {
    userid: {
      type: DataTypes.STRING(60),
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    apellido: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  });
  return User;
}

module.exports = {
  createModel,
};
