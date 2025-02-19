const mysql = require('mysql2/promise');
const logger = require('./Logger');
require('dotenv').config();

// Crear un pool de conexiones
const pool = mysql.createPool({
    host: '192.168.56,1', // Cambiado a localhost
    user: 'root',      // Usuario de tu base de datos local
    password: 'davids00', // Contraseña de tu base de datos local
    database: 'CalculatorDB', // Nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    port: 3306, // Puerto de MySQL
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