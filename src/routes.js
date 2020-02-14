const { Router } = require('express');
const UserController = require('./controllers/UserController');

const routes = Router();

routes.post('/user', UserController.store);

module.exports = routes;