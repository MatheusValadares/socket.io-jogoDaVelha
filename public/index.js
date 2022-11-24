const socket = io('http://localhost:3000');

socket.on('idRoom', (id) => {

  window.location.href = `http://localhost:3000/${id}`;

})


function createRoom() {

  socket.emit('createRoom');

}