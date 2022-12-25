const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');
const game = require('./model/game').game;
const rooms = require('./model/game').rooms;
const ioController = require('./controllers/ioController');

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/room', express.urlencoded({ extended: false }), (req, res) => { res.sendFile(path.join(__dirname + '/public/room.html')) });
app.get('/:room', express.urlencoded({ extended: false }), (req, res) => {

  let room = req.params.room;

  if (game.checkExistenceRoom(room) == true) {
    if (game.checkPlayers(rooms[game.indexRoom(room)]) < 2) {
      res.sendFile(path.join(__dirname + '/public/room.html'))
    } else {
      res.send("Essa sala já possui dois participantes!");
    }
  } else {
    res.send("Essa sala não existe!");
  }

});

const server = app.listen('3000', () => { console.log("running") });

const io = socketIo(server);

const onConnection = (socket) => {
  ioController(io, socket);
}

io.on('connection', onConnection);



