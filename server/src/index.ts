import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connnected ${socket.id}`);

  socket.on(
    'SEND_MESSAGE',
    ({ message, name }: { message: string; name: string }) => {
      socket.broadcast.emit('RECEIVE_MESSAGE', { message, name });
    }
  );
});

const port = parseInt(process.env.PORT ?? "3001");
server.listen(port, () => console.log(`Server running on port ${port}`));
