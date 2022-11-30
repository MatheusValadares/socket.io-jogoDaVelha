

function enterRoom() {

  let idRoom = document.getElementById('idRoom').value;
  window.location.href = `http://localhost:3000/${idRoom}`;
}

function createRoom() {

  window.location.href = `http://localhost:3000/room`;

}