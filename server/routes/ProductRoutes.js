const express = require("express");
const multer = require("multer");
const productController = require("../controllers/ProductController");
const authMiddleware = require('../middlewares/authMiddleware.js')
const resenasController = require("../controllers/reseñasController.js");
const router = express.Router();

// Configuración de multer
const upload = multer({ dest: "uploads/" }); // ✅ SOLO ESTA

// Rutas
router.post("/",authMiddleware,upload.single("imagen"), productController.Post);
router.get("/",productController.get);
router.put("/editar/:id", authMiddleware ,upload.single("imagen"), productController.put); // ✅ Agregá multer acá también
router.delete("/:id", authMiddleware, productController.delete);

module.exports = router;

router.post("/",upload.single('imagen'),productController.Post)
router.get("/",productController.get)
router.put("/editar/:id",productController.put)
router.delete("/:id",productController.delete)
router.get("/:productoId/resenas", resenasController.obtenerResenas);
router.post("/:productoId/resenas", resenasController.crearResena);
module.exports = router