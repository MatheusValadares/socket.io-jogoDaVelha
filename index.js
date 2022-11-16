const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');

app.use('/', express.static(path.join(__dirname, 'public')));

const server = app.listen('3000', () => { console.log("running") });

const io = socketIo(server);

io.on('connection', (socket) => {

  console.log("new connection")

})



const sala = {
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
  ]
}

function handleMove(position) {

  if (sala.gameOver) {
    return;
  }

  if (sala.board[position] == '') {
    sala.board[position] = sala.symbols[sala.playerTime];

    sala.gameOver = isWin();

    if (sala.gameOver == false) {

      sala.playerTime = (sala.playerTime == 0) ? 1 : 0;

      // if (playerTime == 0) {
      //    playerTime = 1;
      // } else {
      //      playerTime = 0;
    }

  }


  return sala.gameOver;

}

function isWin() {

  for (let i = 0; i < sala.winStates.length; i++) {
    let seq = sala.winStates[i];

    let post1 = seq[0];
    let post2 = seq[1];
    let post3 = seq[2];

    if (sala.board[post1] == sala.board[post2] && sala.board[post1] == sala.board[post3]
      && sala.board[post1] != '') {
      return true;
    }


  }

  return false;

}


