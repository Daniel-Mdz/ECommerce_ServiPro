import { Router } from "express";
import { BringUsers, RegisterUser, pool } from "../services/conexion.mjs";

const router = Router();

router.get('/', (req, res) => res.render('index', { title: 'ServiPro - Los mejores servicios' }));
router.get('/about', (req, res) => res.render('about', { title: 'ServiPro - Sobre nosotros' }));
router.get('/contact', (req, res) => res.render('contact', { title: 'ServiPro - Contáctanos' }));
router.get('/login', (req, res) => res.render('login', { title: 'ServiPro - Login' }));
router.get('/register', (req, res) => res.render('register', { title: 'ServiPro - Registrate' }));
router.get('/contratar', (req, res) => res.render('contratar', { title: 'ServiPro - Servicios Disponibles' }));
router.get('/ofrecer', (req, res) => res.render('ofrecer', { title: 'ServiPro - Ofrecer Servicios' }));

router.get('/api/usuarios', async (req, res) => {
    try {
        const usuarios = await BringUsers();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios', error.stack);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

router.post('/api/register', async (req, res) => {
    console.log(req.body); // Verificar los datos recibidos
    const { username, email, password, firstName, lastName, dni, phoneNumber, city, region, postalCode, country, address, dateOfBirth, gender } = req.body;

    try {
        const userId = await RegisterUser({
            username,
            email,
            password,
            firstName,
            lastName,
            dni,
            phoneNumber,
            city,
            region,
            postalCode,
            country,
            address,
            dateOfBirth,
            gender
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error al registrar el usuario', error.stack);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

router.get('/check-username', async (req, res) => {
    const { username } = req.query;

    try {
        const client = await pool.connect(); // Usa el pool en lugar de Client
        const result = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        client.release(); // Asegúrate de liberar el cliente

        const exists = result.rows[0].count > 0;
        res.json({ exists });
    } catch (error) {
        console.error('Error al verificar el nombre de usuario', error.stack);
        res.status(500).json({ message: 'Error al verificar el nombre de usuario' });
    }
});

export default router;