// src/models/index.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Cargar TODOS los modelos primero ---

// Modelos que se auto-inicializan
db.TestResult = require('./result.model');
db.User = require('./user.model');

// Modelos que usan el patrón de fábrica (factory pattern)
db.Post = require('./post.model')(sequelize, DataTypes);
db.Comment = require('./comment.model')(sequelize, DataTypes);
db.PostIdentify = require('./post-identify.model')(sequelize, DataTypes);
db.CommentIdentify = require('./comment-identify.model')(sequelize, DataTypes);


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


module.exports = db;