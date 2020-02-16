const Product = require('../models/Product')

module.exports = {

  async store(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async update(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async delete(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async show(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

  async index(req, res) {
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: 'Falha na requisição!', error })
    }
  },

}