const express = require("express")
const ordenController = require("../controllers/ordenController.js")
const router = express.Router()


router.post("/",ordenController.crearO)
router.get("/",ordenController.getO)

module.exports = router