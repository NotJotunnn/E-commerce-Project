const UserPermissionService = require("../services/userPermissionServices");

class UserPermissionController {
  static async cadastrarPermissao(req, res) {
    try {
      const newPermission = await UserPermissionService.cadastrar(req.body);

      res.status(201).send({
        message: "Cadastro de permissão criado com sucesso.",
        data: newPermission,
      });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async cadastrarPermissaoBatch(req, res) {
    try {
      const { user_id, permissionsArray } = req.body;

      if (permissionsArray.length == 0)
        res
          .status(400)
          .send({ message: "Array de permissões vazio.", data: {} });

      const registeredPermissions = permissionsArray.map(
        async (permission_id) =>
          await UserPermissionService.cadastrar({ user_id, permission_id })
      );

      res
        .status(201)
        .send({
          message: "Permissões cadastradas com sucesso.",
          data: registeredPermissions,
        });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarPermissoes(_, res) {
    try {
      const permissions = await UserPermissionService.pegar();

      res
        .status(200)
        .send({
          message: "Permissões pegadas com sucesso.",
          data: permissions,
        });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarPermissaoPorId(req, res) {
    const { id } = req.params;

    try {
      const permission = await UserPermissionService.pegarPorId(id);

      res
        .status(200)
        .send({ message: "Permissão pega com sucesso.", data: permission });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async atualizarPermissao(req, res) {
    const { user_id, permission_id } = req.params;

    try {
      const updatedPermission = await UserPermissionService.atualizar(
        user_id,
        permission_id
      );

      res
        .status(200)
        .send({
          message: "Permissão atualizada com sucesso.",
          data: updatedPermission,
        });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async deletarPermissao(req, res) {
    const { user_id, permission_id } = req.params;

    try {
      await UserPermissionService.deletar({ user_id, permission_id });

      res
        .status(200)
        .send({ message: "Permissões deletadas com sucesso.", data: {} });
    } catch (err) {
      res.status(200).send({ message: err.message, data: {} });
    }
  }
}

module.exports = UserPermissionController;
