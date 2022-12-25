const express = require('express');
const router = express.Router();
const path = require('path');
const routerController = require('../controllers/routerController');

router.use('/', express.static(path.join(__dirname, '../public')));

router.get('/room', express.urlencoded({ extended: false }), routerController.createRoomURL);

router.get('/:room', express.urlencoded({ extended: false }), routerController.accessRoom);

module.exports = router;