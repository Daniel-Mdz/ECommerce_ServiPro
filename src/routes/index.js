import { Router } from "express";
import multer from 'multer';
import { BringUsers, RegisterUser, pool } from "../services/conexion.mjs";

const router = Router();
const upload = multer(); // Para manejar datos del formulario

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

router.post('/api/register', upload.none(), async (req, res) => {
    const { 
        username, email, password, firstName, lastName, dni, phoneNumber, city, region, postalCode, country, address, dateOfBirth, gender 
    } = req.body;

    // Verifica que todos los campos necesarios están presentes
    if (!username || !email || !password || !firstName || !lastName || !dni || !phoneNumber || !city || !region || !postalCode || !country || !address || !dateOfBirth || !gender) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Llama a tu función de registro aquí
        await RegisterUser({
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

        res.status(200).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
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