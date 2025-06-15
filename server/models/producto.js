const mongoose = require("mongoose")

const productoSchema = new mongoose.Schema({
    nombre : {
      type:String,
      require : true
    
    },
    precio :{
        type : Number,
        require : true
    },
    descripcion :{
        type : String,
        require : true
    },
    imagen:{
        type : String,
        require : true
    }
})

const Producto = mongoose.model('Productos',productoSchema)

module.exports = Producto