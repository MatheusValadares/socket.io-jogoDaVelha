const socket = io('http://localhost:3000');
const URLroom = window.location.pathname.replace(/\//g, '');
let idRoom = undefined;
let player = undefined;


if (URLroom === 'room') {
  socket.emit('createRoom');
} else {
  idRoom = URLroom;
  socket.emit('enterRoom', idRoom);
}

socket.on('idRoom', (data) => {
  idRoom = data.idRoom;
  player = data.player;
  gameStatus = data.gameStatus;
  addElementID(idRoom);
  updateGameStatus(gameStatus);
});

socket.on('fullRoom', () => {
  window.location.href = `http://localhost:3000`;
})

socket.on('updateGameStatus', (gameStatus) => {
  updateGameStatus(gameStatus);
})

socket.on('update_board', (data) => {
  board = data;
  updateSquares();
});

socket.on('winner', (winner) => {
  gameOverView(winner)
})

socket.on('draw', () => {
  gameOverView();
})

socket.on('newGame', () => {
  removeGameOverView();
})

function handleClick(event) {

  let square = event.target;
  let position = square.id;

  socket.emit('handle_move', { position: position, idRoom: idRoom, id: player });

}

function updateSquares() {

  let squares = document.querySelectorAll('.square');

  squares.forEach((square) => {

    let position = square.id;
    let symbol = board[position];

    if (symbol != '') {
      square.innerHTML = `<div class="${symbol}"><div>`
    }


  })

}

function addElementID(idRoom) {

  let id = document.getElementById('elementID');
  id.innerHTML = `ID da sala: ${idRoom}`;

}

function updateGameStatus(gameStatus) {

  let status = document.getElementById('gameStatus');
  status.innerHTML = '';

  switch (gameStatus) {

    case 'waiting':
      status.innerHTML = 'Aguardando outro jogador entrar...';
      break;
    case player:
      status.innerHTML = 'Sua vez de jogar';
      break;
    case 'gameOver':
      status.innerHTML = 'O jogo acabou!';
      break;
    default:
      status.innerHTML = 'Vez do outro jogador';
      break;

  }

}

function gameOverView(winnerPlayer) {

  if (winnerPlayer == undefined) {
    setTimeout(() => {

      let gameOver = document.getElementById('gameOver');
      let sms = document.getElementById('msgGameOver');
      sms.innerHTML = `Fim de jogo!<br>Ninguém venceu!`
      gameOver.style.display = 'flex';

    }, 1000);

    return
  }

  let winner = undefined;

  if (winnerPlayer == 0) {
    winner = 'jogador 1';
  } else {
    winner = 'jogador 2';
  }

  setTimeout(() => {

    let gameOver = document.getElementById('gameOver');
    let sms = document.getElementById('msgGameOver');
    sms.innerHTML = `Fim de jogo!<br>O ${winner} venceu!`
    gameOver.style.display = 'flex';

  }, 1000);

}

function restart() {

  socket.emit('restartGame', idRoom);

}

function removeGameOverView() {

  let squares = document.querySelectorAll('.square');

  squares.forEach((square) => {
    square.innerHTML = '';
  })

  let gameOver = document.getElementById('gameOver');
  let sms = document.getElementById('msgGameOver');
  sms.innerHTML = '';
  gameOver.style.display = 'none';

}

document.addEventListener('DOMContentLoaded', () => {

  let squares = document.querySelectorAll('.square');

  squares.forEach((square) => {

    square.addEventListener('click', handleClick);

  })

})