const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../common/constants');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Asegúrate de que `decoded.user` existe
        console.log('Usuario autenticado');
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.status(403).json({ message: 'Token inválido' });
    }
};

module.exports = verifyJWT;
