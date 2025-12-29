require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Database Keep-Alive
setInterval(async () => {
    try {
        await pool.query('SELECT 1');
    } catch (err) {
        console.error('DB Keep-Alive Ping: Failed', err);
    }
}, 5 * 60 * 1000);

module.exports = pool;
