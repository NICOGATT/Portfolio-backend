const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDb = require('./config/db');

const usuarioRoutes = require('./routes/usuario.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
const tecnologiaRoutes = require('./routes/tecnologia.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', usuarioRoutes);
app.use('/api', proyectoRoutes);
app.use('/api', tecnologiaRoutes);
app.use('/api', contactRoutes);

const startServer = async () => {
    await conectarDb();
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
};

startServer();
