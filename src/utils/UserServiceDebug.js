const Database = require("../Knex/database");

class UserServiceDebug {
  // ! FOR DEBUG ONLY
  static async pegarPorEmail(email) {
    try {
      if (!email) throw new Error("Email não incluso.");

      const user = await Database("users").where("email", email).select("id").first();

      if (!user) throw new Error("Usuário não cadastrado.");

      return user;
    } catch (err) {
      throw new Error(
        `Não foi possível pegar usuário por email: ${err.message}`
      );
    }
  }
}

module.exports = UserServiceDebug