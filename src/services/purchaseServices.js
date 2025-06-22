const Database = require("../Knex/database");
const PurchaseValidation = require("../utils/purchaseValidation");
const { v4: uuidV4 } = require("uuid");
const ProductServices = require("./productServices");

class PurchaseService {
  static async pegar() {
    try {
      return await Database("purchases");
    } catch (err) {
      throw new Error(`Não foi possível pegar histórico: ${err.message}`);
    }
  }

  static async cadastrar(dto) {
    try {
      if (
        !dto ||
        !dto.user_id ||
        !dto.product_id ||
        !dto.total_price ||
        !dto.price_per_unit ||
        !dto.payment_method ||
        !dto.quantity
      ) {
        throw new Error(
          "Campos 'user_id' 'product_id' 'total_price' 'price_per_unit' 'payment_method' 'quantity' são necessários."
        );
      }

      await PurchaseValidation.validarCompra(dto);

      const id = uuidV4();

      const product = await ProductServices.pegarPorId(dto.product_id);

      await ProductServices.atualizar(dto.product_id, {
        quantity: product.quantity - dto.quantity,
        availability: product.quantity - dto.quantity > 0 ? true : false,
      });

      await Database("purchases").insert({ id, ...dto, status: "Pending" });

      return await Database("purchases").where({ id }).first();
    } catch (err) {
      throw new Error(
        `Não foi possível cadastrar uma nova compra: ${err.message}`
      );
    }
  }

  static async pegarPorId(id) {
    try {
      if (!id) throw new Error("Id não incluso.");

      return await Database("purchases").where({ id }).first();
    } catch (err) {
      throw new Error(`Não foi possível pegar compra por id: ${err.message}`);
    }
  }

  static async pegarPorUserId(id) {
    try {
      if (!id) throw new Error("Id de usuário não incluso.");

      return await Database("purchases").where({ user_id: id });
    } catch (err) {
      throw new Error(`Não foi possível pegar compra por id: ${err.message}`);
    }
  }

  static async atualizar(id, dto) {
    try {
      if (!id) throw new Error("Id não incluso.");

      await PurchaseValidation.validarCompra(dto);

      await Database("purchases")
        .where({ id })
        .update({ ...dto });

      return Database("purchases").where({ id }).first();
    } catch (err) {
      throw new Error(`Não foi possível atualizar compra: ${err.message}`);
    }
  }
}

module.exports = PurchaseService;
