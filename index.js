const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');

app.use('/', express.static(path.join(__dirname, 'public')));

const server = app.listen('3000', () => { console.log("running") });

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

const io = socketIo(server);

