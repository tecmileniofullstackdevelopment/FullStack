const express                             = require('express');
const session                             = require('express-session');
const bodyParser                          = require('body-parser');
const cookieParser                        = require('cookie-parser'); // Middleware para manejar cookies
const app                                 = express();
const PORT                                = 3000;

const { authenticateUser, registerUser }  = require('./auth');

app.use(bodyParser.json());
app.use(cookieParser()); // Habilita el manejo de cookies
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta "public"
app.use(session({
    secret: process.env.SESSION_SECRET, // 🔐 Cambia esto en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true } // `secure: true` si usas HTTPS
}));

/**
 * Ruta para realizar cálculos matemáticos.
 * Recibe dos números y una operación desde el cuerpo de la solicitud.
 * Guarda los cálculos en el historial.
 */
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
            result = b !== 0 ? a / b : 'Error'; // Evita la división por cero
            break;
        default:
            return res.status(400).json({ error: 'Operación no válida' });
    }

    // history.push({ prev, current, operation, result }); // Agrega la operación al historial
    res.json({ result });
});

/**
 * 📌 Ruta para registrar un nuevo usuario.
 */
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const success = await registerUser(username, password);

    if (success) {
        res.json({ message: 'Usuario registrado exitosamente' });
    } else {
        res.status(400).json({ error: 'El usuario ya existe' });
    }
});

/**
 * 📌 Ruta para iniciar sesión con cookies de sesión.
 */
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    console.log("intento de inicio de sesión para:", username);


    if (!user) {
        console.log("Autentificacion fallida para:", username);
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Almacenar el usuario en la sesión
    req.session.user = user;
    console.log("Sesión iniciada para", username);
    res.json({ message: 'Login exitoso', user });
});

/**
 * 📌 Ruta para verificar si la sesión está activa.
 */
app.get('/auth/session-status', (req, res) => {
    if (req.session.user) {
        res.json({ session: 'active', user: req.session.user.username });
    } else {
        res.json({ session: 'inactive', message: 'Sesión no iniciada' });
    }
});

/**
 * 📌 Ruta para cerrar sesión.
 */
app.post('/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
        res.clearCookie('connect.sid'); // Eliminar la cookie de sesión
        res.json({ message: 'Sesión cerrada' });
    });
});


/**
 * Inicia el servidor en el puerto definido.
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
