const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'mydevmysql2025.mysql.database.azure.com',
    user: 'fullstack',  // Cambia esto según tu usuario de MySQL
    password: 'Mamberroi0725.',  // Pon tu contraseña de MySQL si tienes una
    database: 'CALCULADORA'
});

connection.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa.');
});

module.exports = connection;
