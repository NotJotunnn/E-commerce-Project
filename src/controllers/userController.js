const UserService = require("../services/userServices")

class UserController {
  static async cadastrarUser(req, res) {
    const { name, hash, email, phone_number } = req.body

    try {
      const newUser = await UserService.cadastrar({ name, hash, email, phone_number })

      res.status(201).send({ message: "Usuário criado com sucesso.", data: newUser })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }
  
  static async pegarUsers(_, res) {
    try {
      const users = await UserService.pegar()

      res.status(200).send({ message: "Usuários pegos com sucesso.", data: users })
    } catch (err) {
      res.status(500).send({ message: err.message, data: {} })
    }
  }

  static async pegarUserPorId(req, res) {
    const { id } = req.params

    try {
      const user = await UserService.pegarPorId(id)

      res.status(200).send({ message: "Usuário pego por id com sucesso.", data: user })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async atualizarUser(req, res) {
    const { id } = req.params

    try {
      const user = await UserService.atualizar(id, req.body)

      res.status(200).send({ message: "Usuário atualizado com sucesso.", data: user })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async deletarUser(req, res) {
    const { id } = req.params

    try {
      await UserService.deletar(id)

      res.status(200).send({ message: "Usuário deletado com sucesso", data: {} })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }
}

module.exports = UserController