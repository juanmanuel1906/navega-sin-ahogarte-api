const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

// Definimos la ruta para obtener las estadísticas
// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
