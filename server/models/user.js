const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es requerido"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    apellido: {
        type: String,
        trim: true,
        maxlength: [50, "El apellido no puede exceder 50 caracteres"]
    },
    email: {
        type: String,
        required: [true, "El email es requerido"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Por favor ingresa un email válido"
        ]
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"]
    },
    rol: {
        type: String,
        enum: {
            values: ["cliente", "admin"],
            message: "El rol debe ser 'cliente' o 'admin'"
        },
        default: "cliente"
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índice para mejorar búsquedas por email
UserSchema.index({ email: 1 });

// Método para no mostrar la contraseña en las respuestas JSON
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Método estático para buscar admin
UserSchema.statics.findAdmin = function() {
    return this.findOne({ rol: "admin" });
};

// Método para verificar si es admin
UserSchema.methods.esAdmin = function() {
    return this.rol === "admin";
};

const User = mongoose.model("usuarios", UserSchema);

module.exports = User;