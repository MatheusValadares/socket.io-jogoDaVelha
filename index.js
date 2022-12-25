const express = require('express');
const app = express();
const socketIo = require('socket.io');
const ioController = require('./controllers/ioController');
const router = require('./routes/router');

app.use('/', router)

const server = app.listen('3000', () => { console.log("running") });

const io = socketIo(server);

const onConnection = (socket) => {
  ioController(io, socket);
}

io.on('connection', onConnection);



