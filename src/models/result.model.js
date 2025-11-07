const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type:  DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  age_range: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  screen_time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  final_score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result_category: {
    type: DataTypes.STRING,
    allowNull: false // 'verde', 'amarillo', 'rojo'
  }
}, {
  timestamps: true, // Esto añade createdAt y updatedAt automáticamente
  tableName: 'test_results'
});

module.exports = TestResult;
