import { Router } from 'express';
import { RegisterUser, pool } from '../services/conexion.mjs';

const router = Router();  

router.get('/', (req, res) => res.render('index', { title: 'ServiPro - Los mejores servicios' }));
router.get('/about', (req, res) => res.render('about', { title: 'ServiPro - Sobre nosotros' }));
router.get('/contact', (req, res) => res.render('contact', { title: 'ServiPro - Contáctanos' }));
router.get('/login', (req, res) => res.render('login', { title: 'ServiPro - Login' }));
router.get('/register', (req, res) => res.render('register', { title: 'ServiPro - Registrate' }));
router.get('/contratar', (req, res) => res.render('contratar', { title: 'ServiPro - Servicios Disponibles' }));
router.get('/ofrecer', (req, res) => res.render('ofrecer', { title: 'ServiPro - Ofrecer Servicios' }));
router.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca al usuario basado en el nombre de usuario
        const userQuery = 'SELECT * FROM users WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);

        if (userResult.rows.length === 0) {
            console.error('No user found with username:', username);
            return res.json({ success: false, message: 'Credenciales incorrectas' });
        }

        const user = userResult.rows[0];

        // Comparación segura de la contraseña
        // console.log(password);
        // console.log(user.password);
        if (user.password === password) {
            // Autenticación exitosa
            return res.json({ success: true, message: 'Autenticación exitosa' });
        }else{
            console.error('Invalid password for username:', username);
            return res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        res.json({ success: false, message: 'Error en la autenticación' });
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
        res.json({ message: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error al registrar el usuario', error.stack);
        res.json({ message: 'Error al registrar el usuario' });
    }
});

router.post('/api/check_username', async (req, res) => {
    const { username } = req.body; // Usar req.body para POST

    try {
        const client = await pool.connect(); // Usa el pool en lugar de Client
        const result = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        client.release(); // Asegúrate de liberar el cliente

        const exists = result.rows[0].count > 0;
        res.json({ exists });
    } catch (error) {
        console.error('Error al verificar el nombre de usuario', error.stack);
        res.json({ message: 'Error al verificar el nombre de usuario' });
    }
});


export default router;