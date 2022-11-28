const socket = io('http://localhost:3000');
const URLroom = window.location.pathname.replace(/\//g, '');
let idRoom = undefined;
let player = undefined;


if (URLroom === 'room') {
  socket.emit('createRoom');
} else {
  socket.emit('checkExistenceRoom', URLroom);
}

socket.on('returnExistenceRoom', (existenceRoom) => {
  if (existenceRoom) {
    idRoom = URLroom;
    socket.emit('enterRoom', idRoom);
  } else {
    window.location.href = `http://localhost:3000`;
  }
})


socket.on('idRoom', (data) => {
  idRoom = data.idRoom;
  player = data.player;
  gameStatus = data.gameStatus;
  addElementID(idRoom);
  updateGameStatus(gameStatus);
});

socket.on('updateGameStatus', (gameStatus) => {
  updateGameStatus(gameStatus);
})

socket.on('update_board', (data) => {
  board = data;
  updateSquares();
});

socket.on('winner', (data) => {
  setTimeout(() => {
    alert("O jogo acabou! O vencedor foi o jogador " + data)
  }, 60);
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

  console.log(gameStatus)
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
      status.innerHTML = 'Vez do outro jogador jogar';
      break;


  }

}

document.addEventListener('DOMContentLoaded', () => {

  let squares = document.querySelectorAll('.square');

  squares.forEach((square) => {

    square.addEventListener('click', handleClick);

  })

})