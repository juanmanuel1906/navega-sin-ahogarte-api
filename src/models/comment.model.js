const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
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
      allowNull: true // Solo se usará para comentarios anónimos
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    identifiesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    paranoid: true
  });

  return Comment;
};