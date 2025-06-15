const mongoose = require("mongoose")

const ordenSchema = new mongoose.Schema({

  user :{ type : mongoose.Schema.Types.ObjectId,ref:'usuarios'},

  items :[
    {
        producto :{type : mongoose.Schema.Types.ObjectId,ref:'Productos'},
        cantidad : Number
    }
  ],
  total : Number,
   createdAt: { type: Date, default: Date.now }
})

    
const orden = mongoose.model("Orden",ordenSchema)

module.exports = orden