const pool = require('./db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // UUID para IDs de sesión únicos

/**
 * 📌 Verifica si un usuario existe en la base de datos y su contraseña es correcta.
 * Si el login es exitoso, se almacena una sesión en la tabla `UserSession`.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {object|null} - Información del usuario y sesión o `null` si las credenciales son incorrectas.
 */
async function authenticateUser(username, password) {
    const sql = 'SELECT ID, Email, Password FROM User WHERE Email = ?';
    const [rows] = await pool.execute(sql, [username]);

    if (rows.length === 0) return null; // Usuario no encontrado

    const user = rows[0];

    // Verificar la contraseña con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) return null;

    // Generar un nuevo session_id
    const sessionId = uuidv4();
    await storeUserSession(user.ID, sessionId);

    return { id: user.ID, username: user.Email, sessionId };
}

/**
 * 📌 Registra un nuevo usuario en la base de datos con contraseña hasheada.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {boolean} - `true` si el usuario fue creado con éxito, `false` si ya existía.
 */
async function registerUser(username, password) {
    // Verificar si el usuario ya existe
    const [existingUser] = await pool.execute('SELECT ID FROM User WHERE Email = ?', [username]);
    if (existingUser.length > 0) return false; // Usuario ya registrado

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO User (Email, Password) VALUES (?, ?)', [username, hashedPassword]);

    return true;
}

/**
 * 📌 Almacena una sesión en la base de datos cuando el usuario inicia sesión.
 * @param {number} userId - ID del usuario autenticado.
 * @param {string} sessionId - ID único de sesión.
 */
async function storeUserSession(userId, sessionId) {
    try {
        console.log(`🔐 Storing session: UserID = ${userId}, SessionID = ${sessionId}`);
        await pool.execute('INSERT INTO UserSession (UserID, SessionID, Created_at) VALUES (?, ?, NOW())', [userId, sessionId]);
        console.log('✅ Session stored successfully.');
    } catch (error) {
        console.error('❌ Error storing session:', error.message);
    }
}

module.exports = { authenticateUser, registerUser, storeUserSession };