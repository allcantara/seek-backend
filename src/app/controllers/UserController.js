// @ts-nocheck
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth.json')

function generateToken({ id }) {
    return jwt.sign({ id }, authConfig.secret, {
        expiresIn: 7200,
    })
}

module.exports = {

    async store(req, res) {
        try {
            const { email, password, name, surname, typeUser } = req.body;

            if(!email || !password || !name || !surname || !typeUser)
                return res.status(401).send({ message: 'Todos os campos são obrigatórios!' })

            if(await User.findOne({ email })) 
                return res.status(400).send({ message: 'Este usuário já existe!' })
            
            const data = req.body
            const user = await User.create(data)
            user.password = undefined
            return res.send({ user })
        } catch(error) {
            console.log(error)
            return res.status(400).send({ message: 'Falha ao registrar usuário!', error })
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body
            if(!email || !password)
                return res.status(401).send({ message: 'Todos os campos são obrigatórios!' })

            const user = await User.findOne({ email }).select('+password')

            if(!user)
                return res.status(400).send({ message: 'Este usuário não existe!' })

            if(!await bcrypt.compare(password, user.password))
                return res.status(203).send({ message: 'Senha incorreta!' })
            
            user.password = undefined

            return res.send({
                user,
                token: generateToken(user.id),
            })
        } catch(error) {
            console.log(error)
            return res.status(400).send({ message: 'Falha na autenticação!', error })
        }
    },

    async update(req, res) {
        try {
            const { username, typeUser, email } = req.body
            if(!username || !typeUser || !email)
              return res.status(401).send({ message: 'Todos os campos são obrigatórios!' })

            const user = await User.findById(req.params.id)

            if(!user)
                return res.status(401).send({ message: 'Este usuário não existe!' })

            if(user.email !== email && await User.findOne({ email })) 
              return res.status(400).send({ message: 'Este e-mail não pode ser utilizado!' })

            const data = { username, typeUser, email, updatedAt: Date.now() }
            const userRes = await User.findByIdAndUpdate(req.params.id, {
              ...data
            }, { new: true })
            
            return res.status(200).send(userRes)
        } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'Falha na requisição!', error })
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params
            if(!await User.findById(id))
              return res.status(400).send({ message: 'Este usuário não existe!' })
      
            await User.findByIdAndRemove(id)
      
            return res.status(200).send({ message: 'Registro deletado com sucesso!' })
          } catch (error) {
            console.log(error)
            return res.status(400).send({ message: 'Falha na requisição!', error })
          }
    },

    async show(req, res) {
        try {
            const { id } = req.params
            const user = await User.findById(id)
      
            if(!user)
              return res.status(400).send({ message: 'Este usuário não existe!' })
      
            return res.status(200).send(user)
          } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'Falha na requisição!', error })
        }
    },

    async index(req, res) {
        try {
            const users = await User.find()
      
            return res.status(200).send(users)
        } catch (error) {
        console.log(error)
        return res.status(400).send({ message: 'Falha na requisição!', error })
        }
    },

}

