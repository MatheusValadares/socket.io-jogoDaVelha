const rooms = [];

const game = {

  deleteRoom: (room) => {

    let index = game.indexRoom(room.name);

    if (room.player0ID == undefined && room.player1ID == undefined) {
      rooms.splice(index, 1);
    }


  },

  checkExistenceRoom: (URLroom) => {

    let existenceRoom = false;
    rooms.forEach(room => {
      if (room.name == URLroom) {
        existenceRoom = true;
      }
    });

    return existenceRoom;

  },

  playerRoom: (playerID) => {

    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].player0ID == playerID || rooms[i].player1ID == playerID) {
        return rooms[i];
      }
    }

  },


  checkPlayers: (room) => {

    if (room.player0ID != undefined && room.player1ID != undefined) {
      return 2;
    } else if (room.player0ID == undefined) {
      return 0;
    } else {
      return 1;
    }

  },

  indexRoom: (idRoom) => {

    for (i = 0; i < rooms.length; i++) {
      if (rooms[i].name == idRoom) {
        return i;
      }
    }

  },

  handleMove: (position, id, room) => {

    if (room.gameOver) {
      return;
    }

    if (room.gameStatus != 0 && room.gameStatus != 1) {
      return;
    }

    if (id != room.playerTime) {
      return
    }

    if (room.board[position] == '') {
      room.board[position] = room.symbols[room.playerTime];

      if (game.isWin(room)) {
        room.gameOver = true;
        return 'winner'
      }

      if (game.checkDraw(room)) {
        room.gameOver = true;
        return 'draw'
      }

      if (room.gameOver == false) {

        room.playerTime = (room.playerTime == 0) ? 1 : 0;
        room.gameStatus = (room.gameStatus == 0) ? 1 : 0;

      }

    }


  },

  isWin: (room) => {

    for (let i = 0; i < room.winStates.length; i++) {
      let seq = room.winStates[i];

      let post1 = seq[0];
      let post2 = seq[1];
      let post3 = seq[2];

      if (room.board[post1] == room.board[post2] && room.board[post1] == room.board[post3]
        && room.board[post1] != '') {

        room.gameStatus = 'gameOver';
        return true;
      }
    }

    return false;

  },

  checkDraw: (room) => {

    let filledSquares = 0;

    room.board.forEach((square) => {
      if (square != '') {
        filledSquares++
      }
    })

    if (filledSquares == 9) {
      room.gameStatus = 'gameOver';
      return true;
    }

    return false;

  },

  restartGame: (room) => {

    room.board = ['', '', '', '', '', '', '', '', '',];
    room.playerTime = (room.playerTime == 0) ? 1 : 0;
    room.gameStatus = room.playerTime;
    room.gameOver = false;

  }

}

module.exports = { game, rooms };

