const Purchase = require('../models/Purchase')
const Product = require('../models/Product')
const ItemPurchase = require('../models/ItemPurchase')
// @ts-ignore
const devicesConfig = require('../../config/devices.json')

const statusConfig = require('../../config/status.json')

const { validateFieldsStore } = require('./utils/validate')


module.exports = {

  async store(req, res) {
    try {
      let products = []
      const { restaurant: restaurantId, user: userId, device, products: productsList, priceTotal, payment, tableNumber, clientName } = req.body

      const valid = await validateFieldsStore(restaurantId,userId, device, productsList, priceTotal, payment, tableNumber, clientName)
      if(valid.error)
        return res.status(401).send({ error: valid.error, message: valid.message })
      
      await Promise.all(productsList.map(async prod => {
        const { item: product, amount } = prod
        const itemPurchase = new ItemPurchase({ product, amount  })
        await itemPurchase.save()
        products.push(itemPurchase._id) 
      }))
      
      const data = {
        restaurant: restaurantId,
        user: device === devicesConfig.APP ? userId : null,
        device,
        priceTotal,
        payment,
        tableNumber,
        clientName,
        status: statusConfig.PROGRESS,
        products
      }

      const purchase = await Purchase.create(data)
      return res.status(200).send(purchase)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async update(req, res) {
    try {
      let products = []
      const { id: purchaseId } = req.params
      const { restaurant: restaurantId, user: userId, device, products: productsList, priceTotal, payment, tableNumber, clientName } = req.body

      const valid = await validateFieldsStore(restaurantId,userId, device, productsList, priceTotal, payment, tableNumber, clientName)
      if(valid.error)
        return res.status(401).send({ error: valid.error, message: valid.message })

      const purchase = await Purchase.findById(purchaseId).populate('products')

      if(!purchase) 
        return res.status(401).send({ message: 'Esta compra não foi cadastrada!' })

      purchase.products = []

      await Promise.all(productsList.map(async prod => {
        const { item: product, amount } = prod
        const item = await ItemPurchase.findById(product)
        if(item) await ItemPurchase.findByIdAndDelete(item._id)
        const itemPurchase = new ItemPurchase({ product, amount  })
        await itemPurchase.save()
        products.push(itemPurchase._id) 
      }))
      
      const data = {
        restaurant: restaurantId,
        user: device === devicesConfig.APP ? userId : null,
        device,
        priceTotal,
        payment,
        tableNumber,
        clientName,
        status: statusConfig.PROGRESS,
        products
      }

      const newPurchase = await Purchase.findByIdAndUpdate(purchaseId, {
        ...data
      }, { new: true })
      
      return res.status(200).send(newPurchase)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async canceled(req, res) {
    try {
      const { id } = req.params
      if(!await Purchase.findById(id))
        return res.status(400).send({ message: 'Esta compra não esta cadastrada!' })

      await Purchase.findByIdAndUpdate(id, {
        status: statusConfig.CANCELED
      })

      return res.status(200).send({ message: 'Registro cancelado com sucesso!' })
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params
      const purchase = await Purchase.findById(id).populate(['products'])
      if(!purchase)
        return res.status(400).send({ message: 'Esta compra não existe!' })

      await Promise.all(purchase.products.map(async item => {
        const { product: productId } = item
        const prod = await Product.findById(productId)
        const ingredient = prod.ingredients.join(', ')
        prod.ingredients = ingredient
        item.product = prod
      }))

      return res.status(200).send(purchase)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async index(req, res) {
    try {
      const purchases = await Purchase.find().populate(['restaurant', 'user'])
      return res.status(200).send(purchases)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

}