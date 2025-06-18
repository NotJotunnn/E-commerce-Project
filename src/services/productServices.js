const Database = require("../Knex/database");

class ProductServices {
  static async cadastrar(dto) {
    try {
      if (
        !dto ||
        !dto.id ||
        !dto.title ||
        !dto.price ||
        !dto.currency ||
        !dto.rating ||
        dto.quantity == 0
      ) {
        throw new Error(
          "Campos 'title', 'price', 'currency', 'rating', 'quantity' não podem estar vazios."
        );
      }

      const productAlreadyExists = await Database("products")
        .where("id", dto.id)
        .first();

      if (productAlreadyExists) throw new Error("Produto já cadastrado.");

      await Database("products").insert(dto);

      return await Database("products").where("id", dto.id).first();
    } catch (err) {
      throw new Error(`Não foi possível cadastrar dessa vez: ${err.message}`);
    }
  }

  static async pegar() {
    try {
      return await Database("products");
    } catch (err) {
      throw new Error(`Não foi possível pegar dessa vez: ${err.message}`);
    }
  }

  static async pegarPaginado(resultsLimit, pageCounter) {
    try {
      if(!resultsLimit) 
        throw new Error("Limite de resultados não declarado.")
      if(!pageCounter)
        throw new Error("Página não declarada.")

      return await Database("products").limit(resultsLimit).offset(resultsLimit * (pageCounter - 1))
    } catch (err) {
      throw new Error(`Não foi possível retornar os produtos paginados: ${err.message}`)
    }
  }

  static async pegarPorId(id) {
    try {
      const product = await Database("products").where("id", id).first();

      if (!product) throw new Error("Produto não cadastrado.");

      return product;
    } catch (err) {
      throw new Error(
        `Não foi possível pegar por id dessa vez: ${err.message}`
      );
    }
  }

  static async atualizar(id, dto) {
    try {
      const productExist = await Database("products").where("id", id);

      if (productExist.length == 0) throw new Error("Produto não cadastrado.");

      await Database("products")
        .where("id", id)
        .update({ ...dto });

      return await { ...productExist[0], ...dto };
    } catch (err) {
      throw new Error(`Não foi possível atualizar dessa vez: ${err.message}`);
    }
  }

  static async deletar(id) {
    try {
      const productExist = await Database("products").where("id", id);

      if (productExist.length == 0) throw new Error("Produto não cadastrado.");

      await Database("products").where("id", id).del();

      return "Produto deletado com sucesso.";
    } catch (err) {
      throw new Error(`Não foi possível deletar dessa vez: ${err.message}`);
    }
  }
}

module.exports = ProductServices;
