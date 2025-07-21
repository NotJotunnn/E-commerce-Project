const Database = require("../Knex/database")

class ProductServiceDebug {
  // ! DEBUG ONLY
  static async pegarPorTitle(title) {
    try {
      return await Database("products").where("title", title).select("id")
    } catch (err) {
      throw new Error(`Não foi possível pegar por debug: ${err.message}`)
    }
  }
}

module.exports = ProductServiceDebug