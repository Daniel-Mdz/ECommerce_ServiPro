import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'serviprodb_user',
    host: 'dpg-cr2kefg8fa8c73dkdvb0-a.oregon-postgres.render.com',
    database: 'serviprodb',
    password: 'N8B2gVqE9CMn7TSnPMH3uyQOvZVKZxcq',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
});

export { pool };

export async function Conectar() {
    try {
        const client = await pool.connect();
        console.log('Conectado a la base de datos');
        client.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos', error.stack);
    }
}

export async function RegisterUser(data) {
    const { username, email, password, firstName, lastName, dni, phoneNumber, city, region, postalCode, country, address, dateOfBirth, gender } = data;

    try {
        const client = await pool.connect();
        const consulta = `
            INSERT INTO users (
                username, email, password, first_name, last_name, dni, phone_number, city, state, postal_code, country, address, date_of_birth, gender, user_type
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'client'
            ) RETURNING id;
        `;
        const values = [username, email, password, firstName, lastName, dni, phoneNumber, city, region, postalCode, country, address, dateOfBirth, gender];
        const result = await client.query(consulta, values);
        client.release();
        return result.rows[0].id;
    } catch (error) {
        console.error('Error al registrar el usuario:', error.stack);
        throw error; // Lanza el error para manejarlo en la ruta
    }
}
