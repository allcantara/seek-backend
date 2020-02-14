const { Router } = require('express')
const UserController = require('./controllers/UserController')

const routes = Router()

routes.post('/user', UserController.store)
routes.post('/login', UserController.login)

module.exports = routes