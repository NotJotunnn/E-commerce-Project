const PermissionService = require("../services/PermissionServices")

class PermissionController {
  static async cadastrarPermissao(req, res) {
    const { name, description } = req.body

    try {
      const newPermission = await PermissionService.cadastrar({ name, description })

      res.status(201).send({ message: "Permissão cadastrada com sucesso.", data: newPermission })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async pegarPermissoes(_, res) {
    try {
      const permissions = await PermissionService.pegar()

      res.status(200).send({ message: "Permissões pegas com sucesso.", data: permissions })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async pegarPermissaoPorId(req, res) {
    const { id } = req.params
    try {
      const permission = await PermissionService.pegarPorId(id)

      res.status(200).send({ message: "Permissão pega por id com sucesso.", data: permission })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async atualizarPermissao(req, res) {
    const { id } = req.params
    try {
      const updatedPermission = await PermissionService.atualizar(id, req.body)

      res.status(200).send({ message: "Permissão atualizada com sucesso.", data: updatedPermission })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async deletarPermissao(req, res) {
    const { id } = req.params
    try {
      await PermissionService.atualizar(id)

      res.status(200).send({ message: "Permissão deletada com sucesso.", data: {} })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }
}

module.exports = PermissionController