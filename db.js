const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Cambia esto según tu usuario de MySQL
    password: '',  // Pon tu contraseña de MySQL si tienes una
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
