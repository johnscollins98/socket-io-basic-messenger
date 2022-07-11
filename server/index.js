const express = require("express");
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User connnected ${socket.id}`);

  socket.on('SEND_MESSAGE', ({ message, name }) => {
    socket.broadcast.emit('RECEIVE_MESSAGE', { message, name })
  })
})

server.listen(3001, () => console.log("Server running on port 3001"))