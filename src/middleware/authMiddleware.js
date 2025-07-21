const { verify, decode } = require("jsonwebtoken");
const { secret } = require("../config/jsonSecret");

const auth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).send({ message: "Usuário não autenticado.", data: {} });

  try {
    const [, accessToken] = token.split(" ");

    verify(accessToken, secret);
    const { id, email } = decode(accessToken);

    req.userId = id;
    req.userEmail = email;

    return next();
  } catch (err) {
    res.status(401).send({ message: err.message, data: {} });
  }
};

module.exports = auth