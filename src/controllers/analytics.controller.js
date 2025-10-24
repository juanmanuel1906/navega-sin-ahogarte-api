const { TestResult, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * 1. Endpoint para obtener todos los tests con paginación.
 */
exports.getAllResults = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await TestResult.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      results: rows
    });
  } catch (error) {
    console.error('Error al obtener todos los resultados:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Endpoint unificado que obtiene todos los datos para el dashboard de analíticas.
 */
exports.getAnalyticsSummary = async (req, res) => {
  try {
    // --- Preparamos todas las consultas para ejecutarlas en paralelo ---

    // Consulta 1: Contar el total de tests
    const totalCountPromise = TestResult.count();

    // Consulta 2: Obtener la distribución por categoría (verde, amarillo, rojo)
    const distributionPromise = TestResult.findAll({
      attributes: [
        'result_category',
        [sequelize.fn('COUNT', sequelize.col('result_category')), 'count']
      ],
      group: ['result_category']
    });

    // Consulta 3: Obtener las estadísticas agregadas por rol
    const resultsByRolePromise = TestResult.findAll({
      attributes: [
        'user_role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'testCount'],
        [sequelize.fn('AVG', sequelize.col('final_score')), 'averageScore']
      ],
      group: ['user_role'],
      order: [[sequelize.literal('testCount'), 'DESC']]
    });

    // --- Ejecutamos todas las promesas al mismo tiempo ---
    const [totalCount, distribution, resultsByRole] = await Promise.all([
      totalCountPromise,
      distributionPromise,
      resultsByRolePromise
    ]);

    // --- Procesamos los resultados de la distribución ---
    const resultsInPercentage = {};
    distribution.forEach(item => {
      const category = item.get('result_category');
      const count = item.get('count');
      resultsInPercentage[category] = {
        count: count,
        percentage: totalCount > 0 ? parseFloat(((count / totalCount) * 100).toFixed(2)) : 0
      };
    });
    
    const finalDistribution = {
      verde: resultsInPercentage.verde || { count: 0, percentage: 0 },
      amarillo: resultsInPercentage.amarillo || { count: 0, percentage: 0 },
      rojo: resultsInPercentage.rojo || { count: 0, percentage: 0 },
      total: totalCount
    };

    // --- Procesamos los resultados por rol ---
    const formattedResultsByRole = resultsByRole.map(item => ({
      role: item.get('user_role'),
      testCount: parseInt(item.get('testCount'), 10),
      averageScore: parseFloat(item.get('averageScore') || 0).toFixed(2)
    }));

    // --- Enviamos la respuesta combinada ---
    res.status(200).json({
      distribution: finalDistribution,
      resultsByRole: formattedResultsByRole
    });

  } catch (error) {
    console.error('Error al obtener el resumen de analíticas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};