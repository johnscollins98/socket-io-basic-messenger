const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connnected ${socket.id}`);

  socket.on('SEND_MESSAGE', ({ message, name }) => {
    socket.broadcast.emit('RECEIVE_MESSAGE', { message, name });
  });
});

const port = process.env.PORT ?? 3001;
server.listen(port, () => console.log(`Server running on port ${port}`));
