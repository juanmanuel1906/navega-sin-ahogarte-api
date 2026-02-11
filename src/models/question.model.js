const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'modules',
        key: 'id'
      },
      field: 'module_id' // Mapeo explícito: JS usa moduleId, BD usa module_id
    },
    text: { 
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'response'
    },
  }, {
    tableName: 'questions',
    timestamps: true,
    underscored: true
  });

  return Question;
};