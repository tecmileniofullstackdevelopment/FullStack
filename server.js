const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'mydevmysql2025.mysql.database.azure.com',  // Cambia esto si tu MySQL está en otro host
    user: 'fullstack',       // Tu usuario de MySQL
    password: 'Mamberroi0725.',       // Tu contraseña de MySQL
    database: 'CALCULADORA'  // El nombre de tu base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para operaciones matemáticas
app.post('/calculate', (req, res) => {
    const { prev, current, operation } = req.body;
    const a = parseFloat(prev);
    const b = parseFloat(current);
    let result = 0;
    switch (operation) {
        case 'add':
            result = a + b;
            break;
        case 'subtract':
            result = a - b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            result = b !== 0 ? a / b : 'Error';
            break;
    }
    res.json({ result });
});

// Ruta para registro de usuario
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    db.query('SELECT * FROM User WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.json({ error: 'Error en la base de datos.' });
        }

        if (result.length > 0) {
            return res.json({ error: 'El nombre de usuario ya está en uso.' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        db.query('INSERT INTO User (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
            if (err) {
                return res.json({ error: 'Error al registrar el usuario.' });
            }
            res.json({ message: 'Usuario registrado exitosamente.' });
        });
    });
});

// Ruta para inicio de sesión
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ error: 'Todos los campos son obligatorios.' });
    }

    // Buscar el usuario en la base de datos
    db.query('SELECT * FROM User WHERE username = ?', [username], async (err, result) => {
        if (err) {
            return res.json({ error: 'Error en la base de datos.' });
        }

        if (result.length === 0) {
            return res.json({ error: 'Usuario no encontrado.' });
        }

        const user = result[0];
        // Comparar la contraseña proporcionada con el hash almacenado
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ error: 'Contraseña incorrecta.' });
        }

        // Si la contraseña es correcta, crear una sesión
        const sessionId = generateSessionId(); // Función para generar un ID de sesión único
        db.query('INSERT INTO user_session (session_id, ID_user) VALUES (?, ?)', [sessionId, user.ID_user], (err, result) => {
            if (err) {
                return res.json({ error: 'Error al crear la sesión.' });
            }
            res.json({ message: 'Inicio de sesión exitoso.', sessionId });
        });
    });
});

// Función para generar un ID de sesión único
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
