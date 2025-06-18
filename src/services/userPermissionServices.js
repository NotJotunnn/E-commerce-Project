const Database = require("../Knex/database");

class UserPermissionService {
  static async cadastrar(dto) {
    const { user_id, permission_id } = dto;

    try {
      if (!user_id || !permission_id)
        throw new Error("Id de usuário e id Permissão são obrigatórios.");

      const relationExist = await Database("user_permissions")
        .where("user_id", user_id)
        .where("permission_id", permission_id);

      if (relationExist) throw new Error("Permissão já concedida.");

      await Database("user_permissions").insert(dto);

      return await Database("user_permissions")
        .where("user_id", user_id)
        .where("permission_id", permission_id)
        .first();
    } catch (err) {
      throw new Error(`Não foi possível conceder permissão: ${err.message}`);
    }
  }

  static async pegar() {
    try {
      return await Database("user_permissions");
    } catch (err) {
      throw new Error(
        `Não foi possível pegar permissões globais: ${err.message}`
      );
    }
  }

  static async pegarPorId(id) {
    try {
      if (!id) throw new Error("Id é obrigatório.");

      const permissionExist = await Database("user_permissions").where("id", id).first();

      if(!permissionExist) throw new Error("Permissão não encontrada")

      return permissionExist
    } catch (err) {
      throw new Error(
        `Não foi possível pegar permissão por id: ${err.message}`
      );
    }
  }

  static async atualizar(user_id, permission_id) {
    try {
      if (!user_id) throw new Error("Id de usuário é obrigatório.");
      if (!permission_id) throw new Error("Id de permissão é obrigatório.");

      return await Database("user_permissions")
        .where("user_id", user_id)
        .update({ permission_id });
    } catch (err) {
      throw new Error(`Não foi possível atualizar permissão: ${err.message}`);
    }
  }

  static async deletar(dto) {
    const { user_id, permission_id } = dto;

    try {
      if (!user_id || !permission_id)
        throw new Error("Id de usuário e permissão obrigatórios.");

      await Database("user_permissions")
        .where("user_id", user_id)
        .where("permission_id", permission_id)
        .del();
      return;
    } catch (err) {
      throw new Error(`Não foi possível deletar permissões: ${err.message}`);
    }
  }
}

module.exports = UserPermissionService;
