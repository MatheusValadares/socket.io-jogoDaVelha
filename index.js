const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/room', express.urlencoded({ extended: false }), (req, res) => { res.sendFile(path.join(__dirname + '/public/room.html')) });
app.get('/:room', express.urlencoded({ extended: false }), (req, res) => { res.sendFile(path.join(__dirname + '/public/room.html')) });

const server = app.listen('3000', () => { console.log("running") });

const io = socketIo(server);

const rooms = []

io.on('connection', (socket) => {

  console.log("new connection")

  socket.on('createRoom', () => {

    let idRoom = socket.id;
    socket.join(idRoom);

    rooms.push({
      name: idRoom,
      board: ['', '', '', '', '', '', '', '', '',],
      playerTime: 0,
      symbols: ['o', 'x'],
      gameOver: false,
      winStates: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ],
      player0: 0,
      player1: 1,
      gameStatus: 'waiting',

    })

    socket.emit('idRoom', { idRoom, player: rooms[indexRoom(idRoom)].player0 });
    socket.emit('updateGameStatus', rooms[indexRoom(idRoom)].gameStatus)

  })

  socket.on('checkExistenceRoom', (URLroom) => {
    let existenceRoom = false;
    rooms.forEach(room => {
      if (room.name == URLroom) {
        existenceRoom = true;
      }
    });

    socket.emit('returnExistenceRoom', existenceRoom);
  })


  socket.on('enterRoom', (idRoom) => {

    socket.join(idRoom);

    indexRoom(idRoom);

    socket.emit('idRoom', { idRoom, player: rooms[indexRoom(idRoom)].player1 });

    socket.emit('update_board', rooms[indexRoom(idRoom)].board);

    rooms[indexRoom(idRoom)].gameStatus = 0;

    io.to(`${idRoom}`).emit('updateGameStatus', rooms[indexRoom(idRoom)].gameStatus)

  });

  socket.on('handle_move', (data) => {

    let idRoom = data.idRoom;
    let position = data.position;
    let id = data.id;

    handleMove(position, id, rooms[indexRoom(idRoom)]);
    io.to(`${idRoom}`).emit('update_board', rooms[indexRoom(idRoom)].board);
    io.to(`${idRoom}`).emit('updateGameStatus', rooms[indexRoom(idRoom)].gameStatus)

  });

})

function indexRoom(idRoom) {

  for (i = 0; i < rooms.length; i++) {
    if (rooms[i].name == idRoom) {
      return i;
    }
  }

}



function handleMove(position, id, room) {

  if (room.gameOver) {
    return;
  }

  if (room.gameStatus != 0 && room.gameStatus != 1) {
    return;
  }

  if (id != room.playerTime) {
    console.log("não é sua vez", id, room.playerTime);
    return
  }

  if (room.board[position] == '') {
    room.board[position] = room.symbols[room.playerTime];

    room.gameOver = isWin(room);

    if (room.gameOver == false) {

      room.playerTime = (room.playerTime == 0) ? 1 : 0;
      room.gameStatus = (room.gameStatus == 0) ? 1 : 0;

    }

  }


}

function isWin(room) {

  for (let i = 0; i < room.winStates.length; i++) {
    let seq = room.winStates[i];

    let post1 = seq[0];
    let post2 = seq[1];
    let post3 = seq[2];

    if (room.board[post1] == room.board[post2] && room.board[post1] == room.board[post3]
      && room.board[post1] != '') {

      io.to(room.name).emit('winner', room.playerTime);
      room.gameStatus = 'gameOver';

      return true;

    }
  }

  return false;

}


