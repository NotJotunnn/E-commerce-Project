const UserPermissionService = require("../services/userPermissionServices");

class UserPermissionController {
  static async cadastrarPermissao(req, res) {
    try {
      const newPermission = await UserPermissionService.cadastrar(req.body);

      res.status(201).send({
        message: "Cadastro de permissão feito com sucesso.",
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
      
      const registeredPermissions = []

      for(const permissionId of permissionsArray) {
        registeredPermissions.push(await UserPermissionService.cadastrar({ user_id, permission_id: permissionId }))
      }

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
          message: "Permissões pegas com sucesso.",
          data: permissions,
        });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarPermissoesPorId(req, res) {
    const { user_id, permission_id } = req.params;

    try {
      const permission = await UserPermissionService.pegarPorId(user_id, permission_id);

      res
        .status(200)
        .send({ message: "Permissão pega com sucesso.", data: permission });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarPermissoesPorUserId(req, res) {
    const { user_id } = req.params

    try {
      const permissions = await UserPermissionService.pegarPorUserId(user_id)

      res.status(200).send({ message: "Permissões pegas com sucesso.", data: permissions })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async deletarPermissao(req, res) {
    const { user_id, permission_id } = req.params;

    try {
      await UserPermissionService.deletar({ user_id, permission_id });

      res
        .status(200)
        .send({ message: "Permissão deletadas com sucesso.", data: {} });
    } catch (err) {
      res.status(200).send({ message: err.message, data: {} });
    }
  }
}

module.exports = UserPermissionController;
