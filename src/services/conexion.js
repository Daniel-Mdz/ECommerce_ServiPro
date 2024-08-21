import pg from 'pg';
const { Client } = pg;

const config={
    user: 'serviprodb_user',
    host: 'dpg-cr2kefg8fa8c73dkdvb0-a.oregon-postgres.render.com',
    database: 'serviprodb',
    password: 'N8B2gVqE9CMn7TSnPMH3uyQOvZVKZxcq',
    port: 5432,
    ssl: {
        rejectUnauthorized: false,
    }
}

export async function Conectar() {
    const cliente = new Client(config)
    try {
        await cliente.connect()
        console.log('Conectado a la base de datos')
    }catch(error){
        console.error('Error al conectar a la base de datos', error.stack)
    }

}