const path = require('path');
const game = require('../model/game').game;
const rooms = require('../model/game').rooms;

module.exports = {

  createRoomURL: (req, res) => {
    res.sendFile(path.join(__dirname, '../public/room.html'))
  },

  accessRoom: (req, res) => {

    let room = req.params.room;

    if (game.checkExistenceRoom(room) == true) {
      if (game.checkPlayers(rooms[game.indexRoom(room)]) < 2) {
        res.sendFile(path.join(__dirname, '../public/room.html'))
      } else {
        res.send("Essa sala já possui dois participantes!");
      }
    } else {
      res.send("Essa sala não existe!");
    }

  }

}