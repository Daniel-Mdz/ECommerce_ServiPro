import express from 'express';
import bodyParser from 'body-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import indexRoute from './routes/index.js';
import { Conectar } from './services/conexion.mjs';

const port = 3200;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configurar vistas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configurar middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

app.use(bodyParser.json()); // Para datos JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para datos de formulario URL encoded

// Configurar rutas
app.use(indexRoute);

// Conectar a la base de datos
Conectar().catch(error => {
    console.error('Error al conectar a la base de datos:', error);
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
