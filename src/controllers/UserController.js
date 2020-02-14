const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = {

    async store(req, res) {
        try {
            const { email } = req.body;
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

            const user = await User.findOne({ email }).select('+password')

            if(!user)
                return res.status(400).send({ message: 'Este usuário não existe!' })

            if(!await bcrypt.compare(password, user.password))
                return res.status(203).send({ message: 'Senha incorreta!' })
            
            user.password = undefined
            return res.send({ user })
        } catch(error) {
            console.log(error)
            return res.status(400).send({ message: 'Falha na autenticação!', error })
        }
    }

}

