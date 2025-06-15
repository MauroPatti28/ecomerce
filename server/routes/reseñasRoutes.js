const express = require('express');
const router = express.Router();
const resenasController = require('../controllers/reseñasController');

router.get('/:productoId', resenasController.obtenerResenas);
router.post('/', resenasController.crearResena);

module.exports = router;