const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Module = sequelize.define('Module', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Foreign Key
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      },
      field: 'course_id' // Forza el nombre de la columna en BD a snake_case explícitamente si es necesario
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'video_id' // Se guardará como video_id en la tabla
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'modules',
    timestamps: true,
    underscored: true
  });

  // Las asociaciones se manejan en index.js, pero este return es crucial
  return Module;
};