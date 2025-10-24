// src/controllers/dashboard.controller.js

const { TestResult, User, sequelize } = require('../models'); // Importa sequelize desde tus modelos
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
      
    // --- 1. Calcular el total de tests completados ---
    const totalTestsPromise = TestResult.count();

    // --- 2. Calcular los usuarios nuevos de hoy ---
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const newUsersTodayPromise = User.count({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
    });

    // --- 3. Calcular el resultado promedio (el más frecuente) ---
    const averageResultPromise = TestResult.findOne({
      attributes: ['result_category', [sequelize.fn('COUNT', sequelize.col('result_category')), 'count']],
      group: ['result_category'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true,
    });

    // --- [NUEVO] 4. Calcular el total de usuarios ---
    const totalUsersPromise = User.count();

    // --- [NUEVO] 5. Calcular el rol más activo ---
    const mostActiveRolePromise = TestResult.findOne({
      attributes: ['user_role', [sequelize.fn('COUNT', sequelize.col('user_role')), 'count']],
      group: ['user_role'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true,
    });


    // --- Ejecutar TODAS las consultas en paralelo ---
    const [
      totalTests, 
      newUsersToday, 
      averageResultData,
      totalUsers,
      mostActiveRoleData
    ] = await Promise.all([
      totalTestsPromise,
      newUsersTodayPromise,
      averageResultPromise,
      totalUsersPromise, // <- Promesa nueva
      mostActiveRolePromise, // <- Promesa nueva
    ]);

    const averageResult = averageResultData ? averageResultData.result_category : 'N/D';
    const mostActiveRole = mostActiveRoleData ? mostActiveRoleData.user_role : 'N/D'; // <- Procesamiento del dato nuevo

    // --- Enviar la respuesta con los nuevos datos ---
    res.status(200).json({
      totalTests,
      newUsersToday,
      averageResult,
      totalUsers,
      mostActiveRole,
    });

  } catch (error) {
    console.error('Error al obtener las estadísticas del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};