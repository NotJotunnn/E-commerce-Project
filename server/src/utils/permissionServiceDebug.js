const Database = require("../Knex/database")

class PermissionServiceDebug {
  // !FOR DEBUG ONLY
  static async pegarPorName(name) {
    try {
      return await Database("permissions").select("id").where("name", name)
    } catch (err) {
      throw new Error(`Não foi possível pegar uma permissão por nome: ${err.message}`)
    }
  }
}

module.exports = PermissionServiceDebug