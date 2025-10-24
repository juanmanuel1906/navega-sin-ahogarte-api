const express = require('express');
const router = express.Router();
// Se importa el objeto controlador completo
const resultController = require('../controllers/result.controller');

// Se llama a la función desde el objeto importado
router.post('/results', resultController.createResult);

module.exports = router;