const game = require('../model/game').game;
const rooms = require('../model/game').rooms;

module.exports = (io, socket) => {

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
      player0ID: idRoom,
      player1ID: undefined,

    })

    socket.emit('idRoom', { idRoom, player: rooms[game.indexRoom(idRoom)].player0 });
    socket.emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus)

  })

  socket.on('enterRoom', (idRoom) => {

    let player = game.checkPlayers(rooms[game.indexRoom(idRoom)]);

    switch (player) {
      case 0: rooms[game.indexRoom(idRoom)].player0ID = socket.id;
        break;
      case 1: rooms[game.indexRoom(idRoom)].player1ID = socket.id;
        break;
    }

    if (player == 2) {
      socket.emit('fullRoom');
    } else {
      socket.join(idRoom);

      socket.emit('idRoom', { idRoom, player: player });

      socket.emit('update_board', rooms[game.indexRoom(idRoom)].board);

      if (rooms[game.indexRoom(idRoom)].gameStatus == 'waiting') {
        rooms[game.indexRoom(idRoom)].gameStatus = 0;
      }

      io.to(`${idRoom}`).emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus);
    }

  });

  socket.on('handle_move', (data) => {

    let idRoom = data.idRoom;
    let position = data.position;
    let id = data.id;

    let resultMove = game.handleMove(position, id, rooms[game.indexRoom(idRoom)]);

    if (resultMove == 'winner') {
      io.to(idRoom).emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus);
      io.to(idRoom).emit('winner', rooms[game.indexRoom(idRoom)].playerTime);
    };

    if (resultMove == 'draw') {
      io.to(idRoom).emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus);
      io.to(idRoom).emit('draw');
    };

    io.to(`${idRoom}`).emit('update_board', rooms[game.indexRoom(idRoom)].board);
    io.to(`${idRoom}`).emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus)

  });

  socket.on('restartGame', (idRoom) => {
    game.restartGame(rooms[game.indexRoom(idRoom)]);
    io.to(`${idRoom}`).emit('update_board', rooms[game.indexRoom(idRoom)].board);
    io.to(`${idRoom}`).emit('updateGameStatus', rooms[game.indexRoom(idRoom)].gameStatus)
    io.to(idRoom).emit('newGame');
  })

  socket.on("disconnecting", () => {

    let room = game.playerRoom(socket.id);
    if (room == undefined) { return }

    if (room.player0ID == socket.id) {
      room.player0ID = undefined;
      game.deleteRoom(room);
    } else if (room.player1ID == socket.id) {
      room.player1ID = undefined;
      game.deleteRoom(room);
    }

  })

}
