const TestResult = require('../models/result.model');

// Función para crear un nuevo resultado
const createResult = async (req, res) => {
  try {
    // Los datos vienen del cuerpo de la petición (enviados desde Angular)
    const { device_id, age_range, gender, user_role, screen_time, final_score, result_category } = req.body;

    // Validación simple
    if (!device_id || !age_range || !user_role || !result_category) {
      return res.status(400).json({ message: 'Faltan datos requeridos.' });
    }

    const newResult = await TestResult.create({
      device_id,
      age_range,
      gender,
      user_role,
      screen_time,
      final_score,
      result_category
    });

    res.status(201).json({ message: 'Resultado guardado con éxito.', data: newResult });

  } catch (error) {
    console.error('Error al guardar el resultado:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Se exporta la función de una forma más explícita
module.exports = {
  createResult
};
