const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // El userId es opcional, para usuarios registrados
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    anonymousNickname: {
      type: DataTypes.STRING,
      allowNull: true // Solo se usará para posts anónimos
    },
    // El deviceId es para usuarios anónimos
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identifiesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'posts',
    timestamps: true,
    paranoid: true // Habilita el borrado suave (soft delete)
  });

  return Post;
};
