const express = require('express');
const app = express();
const path = require('path');
const socketIo = require('socket.io');

app.use('/', express.static(path.join(__dirname, 'public')));

const server = app.listen('3000', () => { console.log("running") });

const io = socketIo(server);