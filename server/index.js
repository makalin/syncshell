require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store active sessions
const sessions = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    if (!sessions.has(sessionId)) {
      const shell = spawn('bash');
      sessions.set(sessionId, { shell, users: new Set() });
      
      shell.stdout.on('data', (data) => {
        io.to(sessionId).emit('terminal-output', data.toString());
      });

      shell.stderr.on('data', (data) => {
        io.to(sessionId).emit('terminal-error', data.toString());
      });
    }
    sessions.get(sessionId).users.add(socket.id);
  });

  socket.on('terminal-input', ({ sessionId, input }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.shell.stdin.write(input);
    }
  });

  socket.on('disconnect', () => {
    sessions.forEach((session, sessionId) => {
      if (session.users.has(socket.id)) {
        session.users.delete(socket.id);
        if (session.users.size === 0) {
          session.shell.kill();
          sessions.delete(sessionId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 