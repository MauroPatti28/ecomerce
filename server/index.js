const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 👉 Añadir bcrypt para encriptar
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/ProductRoutes.js");
const ordenRoutes = require("./routes/ordenRoutes.js");
const { stripeWebhook } = require("./controllers/webhook.js");
const resenasRoutes = require("./routes/reseñasRoutes.js");
// 👉 Importar el modelo User para crear admin
const User = require("./models/user.js"); // Asegúrate de que la ruta sea correcta
const mongoUri = process.env.MONGODB_URI
const server = express();

// ✅ Webhook: usar bodyParser.raw ANTES de express.json()
server.post("/webhook", bodyParser.raw({ type: "application/json" }), stripeWebhook);

// Luego los demás middlewares
server.use(cors({
  origin: ['https://ecomerce-ruddy-eta.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));server.use(express.json());
server.use("/uploads", express.static("uploads"));
server.use("/usuarios", userRoutes);
server.use("/productos", productRoutes);
server.use("/ordenes", ordenRoutes);
server.use("/resenas", resenasRoutes); 

// 👉 Función para crear admin por defecto con contraseña encriptada
async function crearAdminPorDefecto() {
  try {
    // Verificar si ya existe un admin
    const adminExistente = await User.findOne({ rol: "admin" });
    
    if (!adminExistente) {
      // 🔐 Encriptar la contraseña antes de guardarla
      const saltRounds = 12; // Número de rondas de salt (más alto = más seguro pero más lento)
      const passwordEncriptada = await bcrypt.hash("admin123", saltRounds);
      
      const nuevoAdmin = new User({
        nombre: "Admin",
        apellido: "Principal",
        email: "admin@tienda.com",
        password: passwordEncriptada, // ✅ Contraseña encriptada
        rol: "admin"
      });
      
      await nuevoAdmin.save();
      console.log("🛡️ Admin por defecto creado con contraseña encriptada:");
      console.log("   📧 Email: admin@tienda.com");
      console.log("   🔑 Password: admin123");
      console.log("   🔐 Contraseña almacenada de forma segura (hash)");
      console.log("   ⚠️ Recuerda cambiar la contraseña en producción");
    } else {
      console.log("🟡 Ya existe un administrador en la base de datos");
      console.log(`   📧 Email: ${adminExistente.email}`);
    }
  } catch (error) {
    console.error("❌ Error al crear admin por defecto:", error.message);
  }
}

// 👉 Función para verificar contraseña (útil para login)
async function verificarPasswordAdmin(passwordIngresada, passwordHasheada) {
  try {
    const esValida = await bcrypt.compare(passwordIngresada, passwordHasheada);
    return esValida;
  } catch (error) {
    console.error("❌ Error al verificar contraseña:", error.message);
    return false;
  }
}

// Conexión Mongo con creación de admin
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,  // Tiempo de espera para conexión
    socketTimeoutMS: 45000,         // Tiempo de espera para operaciones
})
.then(async () => {
    console.log("✅ Conectado a MongoDB Atlas");
    await crearAdminPorDefecto();
})
.catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err);
    process.exit(1);  // Salir de la aplicación si no hay conexión
});
server.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});

// 👉 Función adicional para verificar variables de entorno (opcional)
function verificarConfiguracion() {
  console.log("\n🔍 Verificando configuración:");
  console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Configurado" : "❌ Falta");
  console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "✅ Configurado" : "❌ Falta");
  console.log("Puerto:", process.env.PORT || "3000 (default)");
  console.log("bcrypt:", "✅ Configurado para encriptar contraseñas");
}

// Llamar verificación al inicio (puedes comentar esta línea después)
verificarConfiguracion();

// 👉 Exportar función de verificación para usar en rutas de login
