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
    }

}

