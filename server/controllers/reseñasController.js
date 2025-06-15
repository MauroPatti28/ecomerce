const Resenas = require('../models/reseñas');

exports.obtenerResenas = async (req, res) => {
    try {
        const { productoId } = req.params;
        if (!productoId) {
            return res.status(400).json({ error: "El productoId es obligatorio" });
        }

        const resenas = await Resenas.find({ productoId });
        res.json({ resenas });
    } catch (error) {
        console.error("Error al obtener resenas:", error);
        res.status(500).json({ error: "Error al obtener resenas" });
    }
};

exports.crearResena = async (req, res) => {
    try {
        const { productoId, texto } = req.body;

        if (!productoId) {
            return res.status(400).json({ error: "El productoId es obligatorio" });
        }

        if (!texto) {
            return res.status(400).json({ error: "El texto de la reseña es obligatorio" });
        }

        const nuevaResena = new Resenas({ productoId, texto });
        await nuevaResena.save();

        res.status(201).json(nuevaResena);
    } catch (error) {
        console.error("Error al crear resena:", error);
        res.status(500).json({ error: "Error al crear resena" });
    }
};