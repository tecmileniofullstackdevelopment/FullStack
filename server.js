const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 4000;
const SECRET_KEY = 'secreto_super_seguro';

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static('public'));

// 📌 RUTA PARA REGISTRO DE USUARIOS
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ error: 'Todos los campos son obligatorios' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar en la base de datos
    db.query('INSERT INTO User (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
        if (err) {
            return res.json({ error: 'Error al registrar el usuario' });
        }
        res.json({ message: 'Usuario registrado correctamente' });
    });
});

// 📌 RUTA PARA LOGIN
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM User WHERE username = ?', [username], async (err, results) => {
        if (err) return res.json({ error: 'Error en el servidor' });

        if (results.length === 0) {
            return res.json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];

        // Comparar contraseñas
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({ error: 'Contraseña incorrecta' });
        }

        // Generar token
        const token = jwt.sign({ userId: user.ID_user }, SECRET_KEY, { expiresIn: '1h' });

        // Guardar sesión en base de datos
        db.query('INSERT INTO user_session (session_id, ID_user) VALUES (?, ?)', [token, user.ID_user]);

        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login exitoso' });
    });
});

// 📌 RUTA PARA CERRAR SESIÓN
app.post('/auth/logout', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ error: 'No estás autenticado' });
    }

    db.query('DELETE FROM user_session WHERE session_id = ?', [token], () => {
        res.clearCookie('token');
        res.json({ message: 'Logout exitoso' });
    });
});

// 📌 RUTA PARA OPERACIONES MATEMÁTICAS
app.post('/calculate', (req, res) => {
    const { prev, current, operation } = req.body;
    const a = parseFloat(prev);
    const b = parseFloat(current);
    let result = 0;

    switch (operation) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide': result = b !== 0 ? a / b : 'Error'; break;
    }

    res.json({ result });
});

app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
