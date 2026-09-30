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
const analyticsRoutes = require('./routes/analytics.routes');
const leadRoutes = require('./routes/lead.routes');

const app = express();
const port = process.env.PORT || 3000;

// CORS_ORIGINS permite sumar orígenes por entorno (ej. el preview de Vercel en staging), separados por coma.
const origenesExtra = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);

app.use(
    cors(
        {
            origin: [
                "https://nicosdev.com.ar",
                "https://www.nicosdev.com.ar",
                "http://localhost:5173",
                "http://192.168.0.213:5173",
                ...origenesExtra
            ],
            credentials : true,
        }
    )
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', usuarioRoutes);
app.use('/api', proyectoRoutes);
app.use('/api', tecnologiaRoutes);
app.use('/api', contactRoutes);
app.use('/api', leadRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

const startServer = async () => {
    await conectarDb();
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
};

startServer();
