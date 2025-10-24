const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PostIdentify = sequelize.define('PostIdentify', {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' }
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
    tableName: 'post_identifies',
    timestamps: false
  });

  return PostIdentify;
};