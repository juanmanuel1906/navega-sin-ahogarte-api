const { DataTypes } = require('sequelize');

// Exportamos una función que recibe la instancia 'sequelize' desde index.js
module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'courses',
    timestamps: true,
    underscored: true
  });
  
  return Course;
};