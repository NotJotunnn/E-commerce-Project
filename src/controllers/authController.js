const AuthService = require("../services/authServices");

class AuthController {
  static async userLogin(req, res) {
    const { email, password } = req.body;

    try {
      const accessToken = await AuthService.login({ email, password });

      res.status(200).send({
        message: "Login efetuado com sucesso.",
        data: {
          accessToken: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }
}

module.exports = AuthController;
