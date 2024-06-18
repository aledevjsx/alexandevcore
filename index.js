const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});


app.get('/partner/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT 1 as codigo, partner, clientruc, client, idfacturacion, idservicio, idwhatsapp, facturl, factkey  FROM maestro WHERE idpartner = $1', [req.params.id]);
        if (result.rows.length === 0) {
            res.json({ codigo: 0, mensaje: 'No se encontraron datos' });
            console.error(`El idpartner ${req.params.id} no se encuentra en la base de datos`);
        } else {
            res.json(result.rows);
        }
    } catch (err) {
        console.error(err);
        res.send('Error ' + err);
    } finally {
        client.release();
    }

});

app.listen(process.env.PORT, () => {
    console.log(`El servicio esta iniciado en el puerto ${process.env.PORT}`);
});