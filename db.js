const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mydevmysql2025.mysql.database.azure.com',
    user: 'fullstack',
    password: 'matilda12345.',
    database: 'CALCULADORA',
    ssl: {
        rejectUnauthorized: true
    }
});

connection.connect(err => {
    if (err) {
        console.error('❌ Error conectando a la BD:', err);
        return;
    }
    console.log('✅ Conexión a MySQL en Azure exitosa.');
});

module.exports = connection;
