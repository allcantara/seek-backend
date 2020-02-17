const Purchase = require('../models/Purchase')
const User = require('../models/User')
const Restaurant = require('../models/Restaurant')
const Product = require('../models/Product')
// @ts-ignore
const devices = require('../../config/devices.json')

module.exports = {

  async store(req, res) {
    try {
      const { restaurant: restaurantId, user: userId, device, products, priceTotal, payment, tableNumber, clientName } = req.body

      if(!device)
        return res.status(401).send({ message: 'O tipo de dispositivo não foi informado!' })

      if(!restaurantId) 
        return res.status(401).send({ message: 'O ID do restaurante é obrigatório!' })

      if(!products || products.length === 0)
        return res.status(401).send({message: 'Um produto deve ser inserido para a compra!' })

      if(!payment)
        return res.status(401).send({ message: 'A forma de pagamento deve ser informada!' })

      if(!priceTotal || priceTotal === 0) 
        return res.status(401).send({ message: 'O total da compra não foi informado!' })
      
      if(device === devices.APP) {
        if(!userId)
          return res.status(401).send({ message: 'O ID do usuário deve ser informado!' })

        if(!await User.findById(userId))
          return res.status(401).send({ message: 'Este usuário não existe!' })
      }

      if(device === devices.WEB) {
        if(!tableNumber) return res.status(401).send({ message: 'Por favor, informe o número da mesa!' })
        if(!clientName) return res.status(401).send({ message: 'Por favor, informe seu nome!' })
      }

      if(!await Restaurant.findById(restaurantId))
        return res.status(401).send({ message: 'Este restaurante não existe!' })

      products.map(async productId => {
        if(!await Product.findById(productId))
          return res.status(401).send({ message: 'Alguns dos produtos informado não está cadastrado!' })
      })
      
      const purchase = await Purchase.create(req.body)

      return res.status(200).send(purchase)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async update(req, res) {

  },

  async delete(req, res) {

  },

  async show(req, res) {

  },

  async index(req, res) {

  },

}