
const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Productos',
    required: true
  },

  texto: {
    type: String,
    required: true,
  },

  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resenas', resenaSchema);   