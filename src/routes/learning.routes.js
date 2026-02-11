const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learning.controller'); // El controlador que me pasaste
const authJwt = require('../middleware/auth.middleware');

// Obtener todos los cursos disponibles
// (Se usa verifyToken para asegurar que solo usuarios registrados vean el contenido)
router.get('/', authJwt.verifyToken, learningController.getAllCourses);

// Obtener los detalles de un curso específico y sus módulos
//router.get('/:courseId', authJwt.verifyToken, learningController.getCourseById);

// Listar todos los módulos de un curso específico
//router.get('/:courseId/modules', authJwt.verifyToken, learningController.getModulesByCourse);

router.post('/:id/progress', authJwt.verifyToken, learningController.submitQuizProgress);

// Iniciar el video de un módulo (Registra el timestamp de inicio)
// Se usa :id para coincidir con req.params.id de tu controlador
router.post('/:id/start-video', authJwt.verifyToken, learningController.startVideo);

// Finalizar y verificar el video de un módulo
// Aquí es donde se ejecuta tu validación de "secondsElapsed"
router.post('/:id/complete-video', authJwt.verifyToken, learningController.completeVideo);

module.exports = router;