
const logger = require('./logger');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined, // Enable SSL dynamically
});

// Test database connection on startup
(async () => {
    try {
        const connection = await pool.getConnection();
        logger.log('✅ MySQL Connected Successfully!');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('❌ MySQL Connection Failed:', error.message);
        process.exit(1); // Exit process if DB connection fails
    }
})();

// Handle unexpected errors & shutdown gracefully
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
