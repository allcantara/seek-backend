// @ts-nocheck
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization; 

  if (!authHeader) {
    console.log('>> TOKEN NÃO INFORMADO!')
    return res.status(203).send({ error: "O token não foi informado!" });
  }

  const parts = authHeader.split(" ");

  if (!parts.length === 2) {
    console.log('>> TOKEN INVÁLIDO!')
    return res.status(203).send({ error: "Token inválido!" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log('>> FORMATO DO TOKEN INVÁLIDO')
    return res.status(203).send({ error: "Formato do token inválido!" });
  }

  jwt.verify(token, authConfig.secret, function(err, decoded) {
    if (err) {
      console.log('>> TOKEN INVÁLIDO!')
      return res.status(203).send({ error: "Token inválido!" });
    }
    return next();
  });
};
