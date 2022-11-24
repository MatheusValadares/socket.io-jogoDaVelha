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
      roomName: idRoom,
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
      player1: 1

    })

    socket.emit('idRoom', { idRoom, player: rooms[0].player0 });

    io.to(`${idRoom}`).emit('update_board', rooms[0].board);

    socket.on('handle_move', (data) => {

      let idRoom = data.idRoom;
      let position = data.position;
      let id = data.id;

      handleMove(position, id, rooms[0]);
      io.to(`${idRoom}`).emit('update_board', rooms[0].board);

    });

  })

  //AJUSTAR EVENTOS

  socket.on('enterRoom', (idRoom) => {

    socket.emit('idRoom', { idRoom, player: rooms[0].player1 });

    socket.emit('update_board', rooms[0].board);

    socket.on('handle_move', (data) => {

      let idRoom = data.idRoom;
      let position = data.position;
      let id = data.id;

      handleMove(position, id, rooms[0]);
      io.to(`${idRoom}`).emit('update_board', rooms[0].board);

    });

  });

  socket.on('handle_move', (data) => {

    let idRoom = data.idRoom;
    let position = data.position;
    let id = data.id;

    handleMove(position, id, rooms[0]);
    io.to(`${idRoom}`).emit('update_board', rooms[0].board);

  });

})




function handleMove(position, id, sala) {

  if (sala.gameOver) {
    return;
  }

  if (id != sala.playerTime) {
    console.log("não é sua vez");
    return
  }

  if (sala.board[position] == '') {
    sala.board[position] = sala.symbols[sala.playerTime];

    sala.gameOver = isWin(sala);

    if (sala.gameOver == false) {

      sala.playerTime = (sala.playerTime == 0) ? 1 : 0;

    }

  }


}

function isWin(sala) {

  for (let i = 0; i < sala.winStates.length; i++) {
    let seq = sala.winStates[i];

    let post1 = seq[0];
    let post2 = seq[1];
    let post3 = seq[2];

    if (sala.board[post1] == sala.board[post2] && sala.board[post1] == sala.board[post3]
      && sala.board[post1] != '') {

      io.emit('winner', sala.playerTime);
      return true;

    }
  }

  return false;

}


