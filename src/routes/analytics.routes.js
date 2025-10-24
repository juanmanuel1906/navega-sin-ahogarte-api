const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authJwt = require('../middleware/auth.middleware'); // Suponiendo que tu middleware está en /middleware/authJwt.js

router.use(authJwt.verifyToken, authJwt.isAdmin);

// Ruta para obtener todos los tests (ej: /api/analytics/results?page=1&limit=10)
router.get('/results', analyticsController.getAllResults);

// Ruta única para obtener el resumen de todas las analíticas
router.get('/summary', analyticsController.getAnalyticsSummary);

module.exports = router;