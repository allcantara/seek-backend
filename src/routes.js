const { Router } = require('express')
const authMiddleware = require('./app/middlewares/auth')
const UserController = require('./app/controllers/UserController')
const ForgotController = require('./app/controllers/ForgotPasswordController')
const RestaurantController = require('./app/controllers/RestaurantController')
const ProductController = require('./app/controllers/ProductController')
const PurchaseController = require('./app/controllers/PurchaseController')


const routes = Router()

routes.post('/user', UserController.store)

routes.post('/login', UserController.login)
routes.post('/forgot_password', ForgotController.forgot)
routes.post('/reset_password', ForgotController.reset)

routes.use(authMiddleware)

routes.put('/user/:id', UserController.update)
routes.delete('/user/:id', UserController.delete)
routes.get('/user/:id', UserController.show)
routes.get('/user', UserController.index)

routes.post('/restaurant', RestaurantController.store)
routes.put('/restaurant/:id', RestaurantController.update)
routes.delete('/restaurant/:id', RestaurantController.delete)
routes.get('/restaurant/:id', RestaurantController.show)
routes.get('/restaurant', RestaurantController.index)

routes.get('/restaurant/products/:id', RestaurantController.indexProducts)

routes.post('/product', ProductController.store)
routes.put('/product/:id', ProductController.update)
routes.delete('/product/:id', ProductController.delete)
routes.get('/product/:id', ProductController.show)
routes.get('/product', ProductController.index)

routes.post('/purchase', PurchaseController.store)
routes.put('/purchase/:id', PurchaseController.update)
routes.put('/purchase/canceled/:id', PurchaseController.canceled)
routes.get('/purchase/:id', PurchaseController.show)
routes.get('/purchase', PurchaseController.index)

module.exports = routes