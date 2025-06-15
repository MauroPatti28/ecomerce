const Orden = require("../models/orden.js")

exports.crearO = async(req,res)=>{

    try{

        const {items,total} = req.body;
        const orden = await Orden.create({user:req.userId,items,total})
          res.status(201).json(orden);

    }
    catch(err){
        console.log("ocurrio un error",err)
    }
}

exports.gerOrdenById = async(req,res)=>{
    try{

        const ordenes = await Orden.find({user : req.userId}.populate('items.producto'))
        res.json({ordenes})
    }
    catch(err){
        console.log("ocurrio un error",err)
    }
}
exports.getO = async(req,res)=>{
    try{
        const ordenes = await Orden.find()
        .populate("user","nombre")
        .populate("items.producto","nombre precio")
        res.json({ordenes})
    }
    catch(err){
        console.log("ocurrio un error",err)
    }
}