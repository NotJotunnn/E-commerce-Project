const Database = require("../Knex/database");
const Product = require("../models/Products");

class ProductServices {
  static async cadastrar(dto) {
    try {
      const { title, price, currency, rating } = dto;

      const newProduct = new Product(title, price, currency, rating);

      await Database("products").insert(newProduct);

      return await Database("products").where("id", newProduct.id).first();
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

  static async pegarPorId(id) {
    try {
      const product = await Database("products").where("id", id).first();

      if(!product) throw new Error("Produto não cadastrado.")

      return product
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

      return await Database("products").where("id", id).first();
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
