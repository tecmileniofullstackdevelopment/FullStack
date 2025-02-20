const mysql = require('mysql2/promise');
const logger = require('./Logger');
require('dotenv').config();

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'davids00',
    database: process.env.DB_NAME || 'CalculatorDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: process.env.DB_PORT || 3307,
});

// Probar la conexión a la base de datos al iniciar
(async () => {
    try {
        const connection = await pool.getConnection();
        logger.debug('✅ MySQL Connected Successfully Using New Logger Class!');
        connection.release(); // Liberar la conexión al pool
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
        process.exit(1); // Salir si la conexión falla
    }
})();

// Manejar errores inesperados y cerrar el pool de conexiones
process.on('SIGINT', async () => {
    try {
        console.log('⚠️ Closing MySQL Connection Pool...');
        await pool.end();
        console.log('✅ MySQL Pool Closed Successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error Closing MySQL Pool:', error.message);
        process.exit(1);
    }
});

module.exports = pool;