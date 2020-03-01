// @ts-nocheck
const User = require("../models/User");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

module.exports = {
  async forgot(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).send({ message: "Este usuário não existe!" });

      const token = crypto.randomBytes(20).toString("hex");

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user.id, {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });

      mailer.sendMail(
        {
          to: email,
          from: "brunoalcantarajc@gmail.com",
          html: `<p>Utilize este token para alterar sua senha: ${token}</p>`,
          context: {
            token
          }
        },
        err => {
          if (err) {
            console.log(err);
            return res
              .status(401)
              .send({ message: "Não foi possível enviar o e-mail!" });
          }
        }
      );

      return res.status(200).send({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        message: "Falha ao recuperar a senha!",
        error
      });
    }
  },

  async reset(req, res) {
    try {
      const { email, token, password } = req.body;
      
      const user = await User.findOne({ email }).select(['passwordResetToken', 'passwordResetExpires'])

      if (!user)
        return res.status(202).send({ message: "Este usuário não existe!" });

      console.log(token, user.passwordResetToken)
      if (token !== user.passwordResetToken)  
        return res.status(202).send({ message: "O token de alteração é inválido!" });

      if (new Date() > user.passwordResetExpires)
        return res.status(202).send({
            message: "Token expirado! Por favor, solicite uma nova mudança de senha!"
          });

      user.password = password;
      user.updatedAt = Date.now();
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      return res.status(200).send({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(400).send({
        message: "Falha na alteração da senha!",
        error
      });
    }
  }
};
