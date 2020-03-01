// @ts-nocheck
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authConfig = require("../../config/auth.json")

function generateToken({ id }) {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: 7200
  })
}

module.exports = {
  async store(req, res) {
    try {
      if(!req.file)
        return res.status(202).send({ message: 'Falha ao identificar a imagem do produto!' })

      const { filename } = req.file
      if(!filename)
        return res.status(202).send({ message: "A foto é obrigatória!" })

      const { username, email, password, name, surname, typeUser } = req.body
      if (!email || !username || !password || !name || !surname || !typeUser)
        return res.status(202).send({ message: "Todos os campos são obrigatórios!" })

      if (await User.findOne({ email }))
        return res.status(202).send({ message: "Este usuário já existe!" })

      const data = req.body
      data.image = filename
      data.restaurant = null
      // data.passwordResetToken = ''
      // data.passwordResetExpires = null

      const user = await User.create(data)
      user.password = undefined
      return res.status(200).send(user)
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .send({ message: "Falha ao registrar usuário!", error })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password)
        return res.status(202).send({ message: "Todos os campos são obrigatórios!" })

      const user = await User.findOne({ email }).select("+password")

      if (!user)
        return res.status(202).send({ message: "Este usuário não existe!" })

      if (!(await bcrypt.compare(password, user.password)))
        return res.status(202).send({ message: "Senha incorreta!" })

      user.password = undefined

      return res.status(200).send({
        user,
        token: generateToken(user.id)
      })
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na autenticação!", error })
    }
  },

  async update(req, res) {
    try {
      const { username, name, surname, typeUser, email } = req.body
      if (!username || !typeUser || !email || !name || !surname)
        return res.status(202).send({ message: "Todos os campos são obrigatórios!" })

      const user = await User.findById(req.params.id)

      if (!user)
        return res.status(202).send({ message: "Este usuário não existe!" })

      if (user.email !== email && (await User.findOne({ email })))
        return res.status(202).send({ message: "Este e-mail não pode ser utilizado!" })

      const data = {
        image: req.file ? req.file.filename : user.image,
        username,
        typeUser,
        name,
        surname,
        email,
        updatedAt: Date.now()
      }

      const userRes = await User.findByIdAndUpdate(req.params.id, {
        ...data
      }, { new: true })

      return res.status(200).send(userRes)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params
      if (!(await User.findById(id)))
        return res.status(400).send({ message: "Este usuário não existe!" })

      await User.findByIdAndRemove(id)

      return res
        .status(200)
        .send({ message: "Registro deletado com sucesso!" })
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  },

  async show(req, res) {
    try {
      const { id } = req.params
      const user = await User.findById(id)

      if (!user)
        return res.status(400).send({ message: "Este usuário não existe!" })

      return res.status(200).send(user)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  },

  async index(req, res) {
    try {
      const users = await User.find()

      return res.status(200).send(users)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  },

  async indexUsersInRestaurant(req, res) {
    try {
      const users = await User.find({ restaurant: req.params.id })

      return res.status(200).send(users)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  },

  async vinculeRestaurantInUser(req, res) {
    try {
      const { restaurant } = req.body
      if (!restaurant)
        return res.status(202).send({ message: "Não foi possível identificar o restaurante!" })

      const user = await User.findById(req.params.id)

      if (!user)
        return res.status(202).send({ message: "Este usuário não existe!" })

      const userRes = await User.findByIdAndUpdate(req.params.id, {
        restaurant,
        updatedAt: Date.now()
      }, { new: true })

      return res.status(200).send(userRes)
    } catch (error) {
      console.log(error)
      return res.status(400).send({ message: "Falha na requisição!", error })
    }
  }
}
