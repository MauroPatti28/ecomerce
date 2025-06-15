const express = require("express")
const router = express.Router()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const userController = require("../controllers/userController.js")
const { stripeWebhook } = require('../controllers/webhook.js');
const authMiddleware = require('../middlewares/authMiddleware.js')


router.post("/webhook",stripeWebhook)
router.get("/",userController.getAllUsers)
router.post("/register",userController.Register)
router.post("/login",userController.Login)
router.post("/pago",authMiddleware,userController.pago)
router.get("/recibo/:sessionId",userController.obtenerRecibo)
module.exports = router