const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-very-secret-key'; // Ideally from env

//Encrypt JWT
function sign(payload, options = {}) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d', ...options });
}

// Decrypt JWT
function verify(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { sign, verify };
