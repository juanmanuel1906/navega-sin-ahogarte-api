const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const resultRoutes = require('./routes/result.routes');
const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde Angular
app.use(express.json()); // Permite entender el JSON que envía Angular

// Rutas
app.use('/api', resultRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/data', protectedRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('API de Navega sin ahogarte funcionando correctamente.');
});

module.exports = app;