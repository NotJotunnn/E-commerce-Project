const Database = require("../Knex/database");

class UserPermissionService {
  static async cadastrar(dto) {
    try {
      if (!dto || !dto.user_id || !dto.permission_id)
        throw new Error("Id de usuário e id Permissão são obrigatórios.");

      const relationExist = await Database("user_permissions")
        .where("user_id", dto.user_id)
        .where("permission_id", dto.permission_id);

      if (relationExist.length > 0) throw new Error("Permissão já concedida.");

      await Database("user_permissions").insert(dto);

      return await Database("user_permissions")
        .where("user_id", dto.user_id)
        .where("permission_id", dto.permission_id)
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

  static async pegarPorUserId(userId) {
    try {
      const permissionExist = await Database("user_permissions")
        .where("user_permissions.user_id", userId)
        .join("permissions", "user_permissions.permission_id", "permissions.id")
        .select("user_id", "permission_id", "name", "description")

      if(!permissionExist) throw new Error("Usuário não possui permissões.")

      return permissionExist
    } catch (err) {
      throw new Error(`Não foi possível pegar permissão por id: ${err.message}`)
    }
  }

  static async pegarPorId(userId, permissionId) {
    try {
      if (!userId) throw new Error("user_id é obrigatório.");
      if (!permissionId) throw new Error("permission_id é obrigatório.");

      const permissionExist = await Database("user_permissions").where("user_id", userId).where("permission_id", permissionId).first();

      if(!permissionExist) throw new Error("Permissão não encontrada.")

      return permissionExist
    } catch (err) {
      throw new Error(
        `Não foi possível pegar permissão por id: ${err.message}`
      );
    }
  }

  static async deletar(dto) {
    try {
      if (!dto || !dto.user_id || !dto.permission_id)
        throw new Error("Id de usuário e permissão obrigatórios.");

      await Database("user_permissions")
        .where("user_id", dto.user_id)
        .where("permission_id", dto.permission_id)
        .del();
      
      return;
    } catch (err) {
      throw new Error(`Não foi possível deletar permissão: ${err.message}`);
    }
  }
}

module.exports = UserPermissionService;
