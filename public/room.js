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
  player = data.player
  console.log(idRoom);
});

socket.on('update_board', (data) => {
  board = data;
  updateSquares();
});

socket.on('winner', (data) => {
  setTimeout(() => {
    alert("O jogo acabou! O vencedor foi o jogador " + data)
  }, 30);
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

document.addEventListener('DOMContentLoaded', () => {

  let squares = document.querySelectorAll('.square');

  squares.forEach((square) => {

    square.addEventListener('click', handleClick);

  })

})