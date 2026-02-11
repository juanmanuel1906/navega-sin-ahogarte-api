const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserModuleProgress = sequelize.define('UserModuleProgress', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'modules', key: 'id' }
    },
    // Momento exacto en que dio Play (para calcular si hizo trampa)
    video_started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Si ya vio el video completo
    video_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Puntaje del quiz (0 a 100)
    quiz_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // Módulo totalmente aprobado (video + quiz)
    is_completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'user_module_progress',
    timestamps: true
  });

  return UserModuleProgress;
};
