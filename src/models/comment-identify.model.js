const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CommentIdentify = sequelize.define('CommentIdentify', {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'comments', key: 'id' }
    },
    // Puede ser un usuario registrado o anónimo
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' }
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'comment_identifies',
    timestamps: false
  });

  return CommentIdentify;
};