/**
 * Controlador para gestionar las publicaciones, comentarios y sus interacciones.
 * @module controllers/postController
 */

// Importamos los modelos de Sequelize y la instancia de sequelize para usar transacciones.
const { Post, Comment, PostIdentify, CommentIdentify, User, sequelize } = require('../models');

/**
 * Crea una nueva publicación.
 * Tras crearla, emite un evento de Socket.IO para notificar a todos los clientes.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.createPost = async (req, res) => {
  try {
    const { message, deviceId, nickname } = req.body;
    const userId = req.userId; // Asumimos que un middleware previo establece esto

    if (!userId && !deviceId) {
      return res.status(400).json({ message: 'Se requiere un identificador de usuario o dispositivo.' });
    }

    const post = await Post.create({
      message,
      userId: userId || null,
      deviceId: userId ? null : deviceId,
      anonymousNickname: userId ? null : nickname,
    });

    // En lugar de hacer otra consulta, recargamos la instancia con la info del autor. Es más eficiente.
    await post.reload({
      include: [{ model: User, attributes: ['name'] }]
    });

    // Emitimos el evento a todos los clientes conectados
    const io = req.app.get('socketio');
    io.emit('newPost', post); 

    res.status(201).json(post);
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ message: 'Error interno al crear la publicación.' });
  }
};

/**
 * Obtiene todas las publicaciones (hilos) con sus autores y comentarios.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'] // Nombre del autor de la publicación
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ['name'] }] // Comentarios con sus respectivos autores
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ message: 'Error interno al obtener las publicaciones.' });
  }
};

/**
 * Añade un comentario a una publicación existente.
 * Emite un evento de Socket.IO para notificar la llegada de un nuevo comentario.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { message, deviceId, nickname } = req.body;
    const userId = req.userId;

    if (!userId && !deviceId) {
      return res.status(400).json({ message: 'Se requiere un identificador.' });
    }

    const comment = await Comment.create({
      message,
      postId,
      userId: userId || null,
      deviceId: deviceId,
      anonymousNickname: userId ? null : nickname,
    });
    
    // Usamos reload() para obtener los datos del autor eficientemente.
    await comment.reload({
        include: [{ model: User, attributes: ['name'] }]
    });

    // Emitimos el evento a todos los clientes
    const io = req.app.get('socketio');
    io.emit('newComment', comment); 

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error al añadir el comentario:', error);
    res.status(500).json({ message: 'Error interno al añadir el comentario.' });
  }
};

/**
 * Añade o quita un "Me identifica" a una publicación.
 * Utiliza una transacción para garantizar la integridad del contador.
 * Emite un evento de Socket.IO con la publicación actualizada.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.toggleIdentify = async (req, res) => {
  const { postId } = req.params;
  const  deviceId  = req._parsedUrl.query;
  const userId = req.userId;

  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    const identifier = userId ? { userId } : { deviceId };
    
    const post = await Post.findByPk(postId, { transaction: t });
    if (!post) {
      await t.rollback();
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }

    const existing = await PostIdentify.findOne({ where: { postId, ...identifier }, transaction: t });

    if (existing) {
      await existing.destroy({ transaction: t });
    } else {
      await PostIdentify.create({ postId, ...identifier }, { transaction: t });
    }

    // Recalculamos el conteo desde la base de datos para asegurar consistencia.
    const newCount = await PostIdentify.count({ where: { postId }, transaction: t });
    post.identifiesCount = newCount;
    
    // Guardamos y confirmamos la transacción
    await post.save({ transaction: t });
    await t.commit();
    
    // Emitimos el evento DESPUÉS de confirmar que todo se guardó correctamente
    const io = req.app.get('socketio');
    io.emit('postUpdated', post); // Usar un evento más genérico como 'updatePost'

    res.status(200).json(post);
  } catch (error) {
    await t.rollback(); // Revertir la transacción en caso de error
    console.error('Error al procesar el "Me identifica":', error);
    res.status(500).json({ message: 'Error interno al procesar el "Me identifica".' });
  }
};

/**
 * Añade o quita un "Me identifica" a un comentario.
 * Emite un evento de Socket.IO para notificar el cambio.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.toggleCommentIdentify = async (req, res) => {
  const { commentId } = req.params;
  const deviceId = req._parsedUrl.query;
  const userId = req.userId;

  const t = await sequelize.transaction(); // Iniciar transacción

  try {
    const identifier = userId ? { userId } : { deviceId };
    const commentIdInt = parseInt(commentId, 10);
    
    if (isNaN(commentIdInt)) {
      await t.rollback();
      return res.status(400).json({ message: 'El ID del comentario no es válido.' });
    }

    const comment = await Comment.findByPk(commentIdInt, { transaction: t });
    if (!comment) {
        await t.rollback();
        return res.status(404).json({ message: 'Comentario no encontrado.' });
    }
    
    const existing = await CommentIdentify.findOne({ where: { commentId: commentIdInt, ...identifier }, transaction: t });

    if (existing) {
      await existing.destroy({ transaction: t });
    } else {
      await CommentIdentify.create({ commentId: commentIdInt, ...identifier }, { transaction: t });
    }
    
    // Recalculamos para evitar inconsistencias.
    const newCount = await CommentIdentify.count({ where: { commentId: commentIdInt }, transaction: t });
    comment.identifiesCount = newCount;

    await comment.save({ transaction: t });
    await t.commit();

    // CORRECCIÓN: Faltaba emitir el evento en tiempo real para actualizar los clientes.
    const io = req.app.get('socketio');
    io.emit('commentUpdated', comment);

    res.status(200).json(comment);
  } catch (error) {
    await t.rollback();
    console.error("Error al procesar 'Me identifica' en comentario:", error);
    res.status(500).json({ message: 'Error interno al procesar el "Me identifica".' });
  }
};

/**
 * Elimina una publicación (borrado suave si el modelo está configurado como 'paranoid').
 * Solo permitido para el autor o un administrador.
 * Emite un evento de Socket.IO para notificar la eliminación.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.deletePost = async (req, res) => {
  try {    
    const { postId } = req.params;
    const deviceId = req._parsedUrl.query;
    const { userId } = req; // Obtenido del middleware de autenticación

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada.' });
    }

    const user = await User.findByPk(userId);
    
    const isAuthor = (post.userId && post.userId === userId) || (post.deviceId && post.deviceId === deviceId);
    const isAdmin = user?.role === 'administrator';
    

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación.' });
    }

    await post.destroy();
    
    // Se notifica a los clientes que la publicación fue eliminada.
    const io = req.app.get('socketio');
    io.emit('postDeleted', { postId: parseInt(postId, 10) });

    res.status(200).json({ message: 'Publicación eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).json({ message: 'Error interno al eliminar la publicación.' });
  }
};

/**
 * Elimina un comentario.
 * Solo permitido para el autor o un administrador.
 * Emite un evento de Socket.IO para notificar la eliminación.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 */
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deviceId = req._parsedUrl?.query;
    const { userId } = req;

    const commentIdInt = parseInt(commentId, 10);
    if (isNaN(commentIdInt)) {
      return res.status(400).json({ message: 'El ID del comentario no es válido.' });
    }
    
    const comment = await Comment.findByPk(commentIdInt);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado.' });
    }

    const user = await User.findByPk(userId);
    
    const isAuthor = (comment.userId && comment.userId === userId) || (comment.deviceId && comment.deviceId === deviceId);
    
    const isAdmin = user?.role === 'administrator';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario.' });
    }

    const postId = comment.postId; // Guardamos el postId antes de eliminar
    await comment.destroy();
    
    // Se notifica a los clientes sobre la eliminación del comentario.
    const io = req.app.get('socketio');
    // Enviamos el ID del post padre para que el frontend sepa dónde buscar y eliminar el comentario.
    io.emit('deleteComment', { commentId: commentIdInt, postId });

    res.status(200).json({ message: 'Comentario eliminado correctamente.' });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ message: 'Error interno al eliminar el comentario.' });
  }
};
