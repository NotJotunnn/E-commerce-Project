const Database = require("../Knex/database");

class PermissionService {
  static async cadastrar(dto) {
    try {
      if (!dto || !dto.name || !dto.description)
        throw new Error("Campos 'name', 'description' são necessários.");

      await Database("permissions").insert(dto);

      const permissionAlreadyExists = await Database("permissions")
        .where("name", dto.name)
        .first();

      if (permissionAlreadyExists) throw new Error("Permissão já cadastrada.");

      return await Database("permissions").where("name", dto.name).first();
    } catch (err) {
      throw new Error(
        `Não foi possível cadastrar uma permissão nova: ${err.message}`
      );
    }
  }

  static async pegar() {
    try {
      return await Database("permissions");
    } catch (err) {
      throw new Error(`Não foi possível pegar permissões: ${err.message}`);
    }
  }

  static async pegarPorId(id) {
    try {
      if (!id) throw new Error("Id não incluso.");

      return await Database("permissions").where("id", id).first();
    } catch (err) {
      throw new Error(
        `Não foi possível pegar uma permissão por id: ${err.message}`
      );
    }
  }

  static async atualizar(id, dto) {
    try {
      if (!id) throw new Error("Id não incluso.");

      const permissionIsFound = await Database("permissions")
        .where("id", id)
        .first();

      if (!permissionIsFound) throw new Error("Permissão não cadastrada.");

      return Database("permissions").where("id", id).update(dto);
    } catch (err) {
      throw new Error(
        `Não foi possível atualizar uma permissão: ${err.message}`
      );
    }
  }

  static async deletar(id) {
    try {
      if (!id) throw new Error("Id não incluso.");

      const permissionIsFound = await Database("permissions")
        .where("id", id)
        .first();

      if (!permissionIsFound) throw new Error("Permissão não cadastrada.");

      return Database("permissions").where("id", id).del();
    } catch (err) {
      throw new Error(
        `Não foi possível atualizar uma permissão: ${err.message}`
      );
    }
  }
}

module.exports = PermissionService;
