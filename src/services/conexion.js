import pg from 'pg';
const { Client } = pg;

const config={
    user: 'servipro_user',
    host: 'dpg-cr18c0rtq21c73cq6tc0-a.oregon-postgres.render.com',
    database: 'servipro',
    password: 'El0n9ddTtNcFwXH0YUW0spSBxP69jN8n',
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