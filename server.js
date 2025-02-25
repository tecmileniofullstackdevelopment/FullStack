const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const { authenticateUser, registerUser, resetPassword, verifyEmailReset } = require('./auth');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(session({
    secret: 'securepassword$', // Cambia esto en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // `secure: true` si usas HTTPS
}));

// Ruta para cálculos matemáticos
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
        default:
            return res.status(400).json({ error: 'Operación no válida' });
    }

    res.json({ result });
});

// Ruta para registrar un nuevo usuario
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const success = await registerUser(username, password);

    if (success) {
        res.json({ message: 'Usuario registrado exitosamente' });
    } else {
        res.status(400).json({ error: 'El usuario ya existe' });
    }
});

// Ruta para iniciar sesión
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);

    if (!user) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    req.session.user = user;
    res.json({ message: 'Login exitoso', user });
});

// Ruta para verificar el estado de la sesión
app.get('/auth/session-status', (req, res) => {
    if (req.session.user) {
        res.json({ session: 'active', user: req.session.user.username });
    } else {
        res.json({ session: 'inactive', message: 'Sesión no iniciada' });
    }
});

// Ruta para cerrar sesión
app.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Sesión cerrada' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

app.post('/auth/check-email', async (req, res) => {
    const { email } = req.body;
    const user = await verifyEmailReset(email);

    if (!user) {
        return res.status(401).json({ exists: false, message: 'Correo inexistente' });
    } else {
        return res.json({ exists: true });
    }
});

app.post('/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await resetPassword(email, newPassword);

    if (!user) {
        return res.status(401).json({ success: false, error: 'Datos incorrectos' });
    } else {
        return res.json({ success: true, message: 'Cambio exitoso' });
    }
});
