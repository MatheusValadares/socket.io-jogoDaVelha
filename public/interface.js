const socket = io('http://localhost:3000');

let board = null;
let id = null;

socket.on('create_id', (data) => {
  id = data;
  console.log(id)
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

  socket.emit('handle_move', { position: position, id: id });

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