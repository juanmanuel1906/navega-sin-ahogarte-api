
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authJwt = require('../middleware/auth.middleware'); 

// Obtener todas las publicaciones
router.get('/', postController.getAllPosts);

// Crear una nueva publicación (con token opcional)
router.post('/', authJwt.verifyTokenOptional, postController.createPost);

// Crear un nuevo comentario (con token opcional)
router.post('/:postId/comments', authJwt.verifyTokenOptional, postController.createComment);

// Añadir/quitar un "Me identifica" (con token opcional)
router.post('/:postId/identify', authJwt.verifyTokenOptional, postController.toggleIdentify);

// Eliminar una publicación
router.delete('/:postId', [authJwt.verifyTokenOptional], postController.deletePost);

// Eliminar un comentario
router.delete('/:postId/comments/:commentId', authJwt.verifyTokenOptional, postController.deleteComment);

// Añadir/quitar un "Me identifica" a un comentario (con token opcional)
router.post('/:postId/comments/:commentId/identify', authJwt.verifyTokenOptional, postController.toggleCommentIdentify);

module.exports = router;