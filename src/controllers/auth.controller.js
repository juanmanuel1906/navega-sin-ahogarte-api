const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate tokens
const generateTokens = (user) => {
  console.log("user for token generation:", user);
  
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '24h' } // 24 hours expiration
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' } // 7 days expiration
  );
  return { accessToken, refreshToken };
};


// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Ya existe un tripulante con este correo electrónico, intenta iniciar sesión." });
    }

    const newUser = await User.create({ name, email, password, role });

    // Genera los tokens para el nuevo usuario
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Envía la misma respuesta que el login
    res.status(201).json({
      message: "Tripulante registrado y autenticado satisfactoriamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: "Ocurrió un error registrando el usuario, revisa tu conexión a internet.", error: error.message });
  }
};


// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Tripulante no encontrado, ¡regístrate ahora!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Credenciales inválidas, ¡inténtalo de nuevo!" });
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


// Refresh Access Token
exports.refreshToken = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh token is required." });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token is not valid." });
        }

        // We don't need to check the DB again, but for extra security you could
        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role }, // Assuming role is needed and was in refresh token payload (or fetch from DB)
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ accessToken: newAccessToken });
    });
};