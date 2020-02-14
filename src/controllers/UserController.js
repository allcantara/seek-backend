const User = require('../models/User')

module.exports = {
    async store(req, res) {
        try {
            const data = User.create(req.body);
            return res.json({ ...data })
        } catch(error) {
            return res.status(400).send({ message: 'Falha ao registrar usuário!', error })
        }
    }
}
