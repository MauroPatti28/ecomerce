const mongoose = require("mongoose");
const producto = require("../models/producto.js");

exports.Post = async (req, res) => {
  try {
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const nuevoProducto = new producto({ nombre, precio, descripcion, imagen });
    await nuevoProducto.save();

    res.status(201).json({ message: "Producto creado exitosamente", producto: nuevoProducto });
  } catch (err) {
    console.error("Ocurrió un error al crear el producto:", err);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

exports.get = async (req, res) => {
  try {
    const productos = await producto.find();
    res.status(200).json(productos);
  } catch (err) {
    console.error("Ocurrió un error al obtener los productos:", err);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

exports.put = async (req, res) => {
  try {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    
   const id = req.params.id;
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const productos = { nombre, precio, descripcion };
    if (imagen) {
      productos.imagen = imagen;
      
    
    }
    const productoActualizado = await producto.findByIdAndUpdate(id, productos, { new: true });

    if (!productoActualizado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto actualizado exitosamente", producto: productoActualizado });
  } catch (err) {
    console.error("Ocurrió un error al actualizar el producto:", err);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const productoEliminado = await producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({ message: "Producto eliminado exitosamente", producto: productoEliminado });
  } catch (err) {
    console.error("Ocurrió un error al eliminar el producto:", err);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const productoIndividual = await producto.findById(id);
    if (!productoIndividual) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(productoIndividual);
  } catch (err) {
    console.error("Error al obtener producto por id:", err);
    res.status(500).json({ error: "Error al obtener producto" });
  }
};