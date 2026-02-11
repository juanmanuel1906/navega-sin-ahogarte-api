const http = require('http');
const app = require('./app');
const { sequelize, Course, Module } = require('./models');
const seedDatabase = require('./config/seed')

// Crea un servidor HTTP a partir de tu app de Express
const server = http.createServer(app);

// Inicializa Socket.IO y únelo al servidor HTTP
const { Server } = require("socket.io");
const io = new Server(server, {
  path: "/api/socket.io/",
  cors: {
    origin: ["http://localhost:4200", "https://navegasinahogarte.com"],
    methods: ["GET", "POST"]
  }
});

// Guarda la instancia de 'io' en la app para poder usarla en los controladores
app.set('socketio', io);

// Lógica de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Un usuario se ha conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Un usuario se ha desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => { // 5. Usa server.listen en lugar de app.listen
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.sync({ force: false }); // Sincroniza los modelos con la BD
    await sequelize.sync({ alter: true }); // Esto añadirá la nueva columna sin borrar datos.
    await seedDatabase({ Course, Module });

    console.log('✅ Base de datos sincronizada.');
  } catch (error) {
    console.error('❌ No se pudo sincronizar la base de datos:', error);
  }
});