const { DataTypes } = require('sequelize');

function createModel(sequelize) {
  const Address = sequelize.define('address', {
    direccion: {
      type: DataTypes.STRING(100),
      unique: true,
    },
  }, {
    timestamps: false,
  });
  return Address;
}

module.exports = {
  createModel,
};
