const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos que se auto-inicializan
db.TestResult = require('./result.model');
db.User = require('./user.model');

// Modelos que usan el patrón de fábrica (factory pattern)
db.Post = require('./post.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.PostIdentify = require('./post-identify.model')(sequelize, DataTypes);
db.CommentIdentify = require('./comment-identify.model')(sequelize, DataTypes);
db.Course = require('./course.model')(sequelize, DataTypes);
db.Module = require('./module.model')(sequelize, DataTypes);
db.Question = require('./question.model')(sequelize, DataTypes);
db.Option = require('./option.model')(sequelize, DataTypes);
db.UserModuleProgress = require('./user-module-progress')(sequelize, DataTypes)

// Definir TODAS las relaciones después de cargar los modelos ---

// Un Usuario puede tener muchos Posts
db.User.hasMany(db.Post, { foreignKey: 'userId' });
db.Post.belongsTo(db.User, { foreignKey: 'userId' });

// Un Post puede tener muchos Comentarios
db.Post.hasMany(db.Comment, { foreignKey: 'postId' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId' });

// Un Usuario puede tener muchos Comentarios
db.User.hasMany(db.Comment, { foreignKey: 'userId' });
db.Comment.belongsTo(db.User, { foreignKey: 'userId' });

// Un Post puede tener muchos "Me identifica"
db.Post.hasMany(db.PostIdentify, { foreignKey: 'postId' });
db.PostIdentify.belongsTo(db.Post, { foreignKey: 'postId' });

// Un Usuario puede dar muchos "Me identifica"
db.User.hasMany(db.PostIdentify, { foreignKey: 'userId' });
db.PostIdentify.belongsTo(db.User, { foreignKey: 'userId' });

// Un Comentario puede tener muchos "Me identifica"
db.Comment.hasMany(db.CommentIdentify, { foreignKey: 'commentId' });
db.CommentIdentify.belongsTo(db.Comment, { foreignKey: 'commentId' });

// Un Usuario puede dar muchos "Me identifica" a comentarios
db.User.hasMany(db.CommentIdentify, { foreignKey: 'userId' });
db.CommentIdentify.belongsTo(db.User, { foreignKey: 'userId' });

// Un Curso puede tener muchos Módulos
db.Course.hasMany(db.Module, { foreignKey: 'courseId', as: 'modules', onDelete: 'CASCADE' });
db.Module.belongsTo(db.Course, { foreignKey: 'courseId' });

// Un Módulo puede tener muchas Preguntas
db.Module.hasMany(db.Question, { foreignKey: 'moduleId', as: 'questions', onDelete: 'CASCADE' });
db.Question.belongsTo(db.Module, { foreignKey: 'moduleId' });

// Una Pregunta puede tener muchas Opciones
db.Question.hasMany(db.Option, { foreignKey: 'questionId', as: 'options', onDelete: 'CASCADE' });
db.Option.belongsTo(db.Question, { foreignKey: 'questionId' });

// Un Usuario tiene muchos registros de progreso
db.User.hasMany(db.UserModuleProgress, { foreignKey: 'userId', as: 'progress' });
db.UserModuleProgress.belongsTo(db.User, { foreignKey: 'userId' });

// Un Módulo tiene muchos registros de progreso (de diferentes usuarios)
db.Module.hasMany(db.UserModuleProgress, { foreignKey: 'moduleId', as: 'userProgress' });
db.UserModuleProgress.belongsTo(db.Module, { foreignKey: 'moduleId' });

module.exports = db;