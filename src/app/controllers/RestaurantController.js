// @ts-nocheck
const Restaurant = require('../models/Restaurant')
const User = require('../models/User')
const typeUser = require('../../config/typeUser.json')


module.exports = {

  async store(req, res) {
    try {
      const { user: id, name, addressName, addressNumber, addressCity, addressCep } = req.body

      if(!id || !name || !addressName || !addressNumber || !addressCity || !addressCep)
        return res.status(401).send({ message: 'Todos os campos são obrigatórios!' })

      const userRec = await User.findById(id);

      if(!userRec)
        return res.status(401).send({ message: 'Um usuário existente deve ser vinculado!' })

      if(userRec.typeUser !== typeUser.ADMIN)
        return res.status(401).send({ message: 'Este usuário não tem permissão para ser vinculado!' })

      if(await Restaurant.findOne({ name })) 
        return res.status(401).send({ message: 'Já existe um restaurante com este nome!' })

      const restaurant = await Restaurant.create(req.body)
      
      return res.status(200).send(restaurant)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async update(req, res) {
    try {

      const { name, addressName, addressNumber, addressCity, addressCep } = req.body

      if(!name || !addressName || !addressNumber || !addressCity || !addressCep)
        return res.status(401).send({ message: 'Todos os campos são obrigatórios!' })

      const { id: _id } = req.params

      let restaurant = await Restaurant.findOne({ _id })

      if(!restaurant)
        return res.status(401).send({ message: 'Este restaurante não existe!' })

      restaurant = { ...req.body }
      
      await restaurant.save()
      
      return res.status(200).send(restaurant)
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async delete(req, res) {
    try {
      

      return res.status(200).send({ ok: true })
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params

      const restaurant = await Restaurant.findById(id).populate('user') // EAGER

      if(!restaurant)
        return res.status(400).send({ message: 'Este restaurante não existe!' })

      return res.status(200).send(restaurant)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async index(req, res) {
    try {
      const restaurants = await Restaurant.find()

      return res.status(200).send(restaurants)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

}