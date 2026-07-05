const mongoose = require('mongoose'); 

const conectarDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conexion exitosa con mongodb")
    } catch (error) {
        console.error("Error al conectar con a MongoDB", error.message);
        throw error;
    }
}

module.exports = conectarDb;
