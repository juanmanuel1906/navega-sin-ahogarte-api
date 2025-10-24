const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authJwt = require('../middleware/auth.middleware'); // Suponiendo que tu middleware está en /middleware/authJwt.js

// Aplica el middleware a todas las rutas de este archivo.
// Solo los administradores podrán acceder a estos endpoints.
router.use(authJwt.verifyToken, authJwt.isAdmin);

// GET /api/users -> Listar todos los usuarios
router.get('/', userController.getAllUsers);

// POST /api/users -> Crear un nuevo usuario
router.post('/', userController.createUser);

// PUT /api/users/:id -> Actualizar un usuario
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id -> Eliminar un usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;
