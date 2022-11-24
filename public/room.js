const socket = io('http://localhost:3000');
const room = window.location.pathname.replace('/\/g', '');

let idRoom = undefined;

socket.emit('createRoom');

socket.on('idRoom', (id) => {
  idRoom = id;
  console.log(idRoom);
});


socket.on('create_id', (data) => {
  id = data;
  console.log(id)
});

socket.on('update_board', (data) => {
  board = data;
  console.log(board);
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

  socket.emit('handle_move', { position: position, idRoom: idRoom, id: 0 });

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