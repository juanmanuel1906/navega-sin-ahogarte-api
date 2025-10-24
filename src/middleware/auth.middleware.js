const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to verify the access token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN  

  if (!token) {
    return res.status(403).json({ message: "Se requiere un token para la autenticación." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Adds user payload (id, role) to the request object
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
  return next();
};

// Middleware to check for a specific role
const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'administrator') {
      return next(); // Si es admin, permite continuar
    }

    // Si no se encuentra el usuario o no es admin, deniega el acceso
    return res.status(403).json({ message: "Acceso denegado. Se requiere rol de administrador." });

  } catch (error) {
    console.error("Error en el middleware isAdmin:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

/**
 * Verifica un token si está presente y, si es válido, adjunta
 * el id y el rol del usuario a la petición. No devuelve error si no hay token.
 */
const verifyTokenOptional = (req, res, next) => {
    let token = req.headers['authorization'];    
    
    if (!token) {
        return next(); // Si no hay token, simplemente continuamos.
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            // Si el token es inválido, no devolvemos error, solo continuamos.
            return next();
        }

        try {
            // Si el token es válido, buscamos al usuario para obtener su rol.
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.userId = user.id;
                req.user.role = user.role;
            }
        } catch (error) {
            console.error("Error al buscar usuario en middleware opcional:", error);
        } finally {
            next();
        }
    });
};

module.exports = { verifyToken, isAdmin, verifyTokenOptional };