const routes = require('express').Router();

const AuthMiddleware = require('./app/middlewares/auth');
const SessionController = require('./app/controllers/SessionController');

routes.post('/sessions', SessionController.store);

// routes under the instruction below only may be accessed with an user authenticated
routes.use(AuthMiddleware);

routes.get('/dashboard', (request, response) => response.send());

module.exports = routes;
