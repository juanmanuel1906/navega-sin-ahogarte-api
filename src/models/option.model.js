const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Option = sequelize.define('Option', {    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'module_id', // Nombre de la columna en la BD
      references: {
        model: 'modules',
        key: 'id'
      }
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'question_id', // Recomendado: usar snake_case en la BD
      references: { 
        model: 'questions', 
        key: 'id' 
      }
    },
    option_text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'options',
    timestamps: false // Según tu configuración, no enviamos created_at/updated_at
  });

  return Option;
};