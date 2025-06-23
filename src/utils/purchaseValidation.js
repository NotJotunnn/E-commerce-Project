const ProductService = require("../services/productServices");
const UserService = require("../services/userServices")

class PurchaseValidation {
  static async validarCompra(dto) {
    if(dto.user_id) {
      const user = await UserService.pegarPorId(dto.user_id)

      if(!user) throw new Error("Usuário não cadastrado.");
    }

    if(dto.product_id) {
      const product = await ProductService.pegarPorId(dto.product_id)

      if(!product) throw new Error("Produto não cadastrado.");

      if(!product.availability) throw new Error("Produto não disponível para compra.");
    }

    if(dto.quantity) {
      const product = await ProductService.pegarPorId(dto.product_id)

      if(dto.quantity > product.quantity) throw new Error("Quantidade não pode ser mais que disponível.")
    }

    if(dto.total_price || dto.total_price == 0) {
      if(dto.total_price == 0) throw new Error("Preço total não pode ser nulo.");
    }

    if(dto.price_per_unit || dto.price_per_unit == 0) {
      if(dto.price_per_unit == 0) throw new Error("Preço unitário não pode ser nulo.");

      const product = await ProductService.pegarPorId(dto.product_id)
      
      if(dto.price_per_unit != product.price) throw new Error("Preço do produto não bate com o registrado.");
    }

    if(dto.total_price && dto.price_per_unit && dto.quantity > 0) {
      if(dto.quantity * dto.price_per_unit != dto.total_price) throw new Error("Valores não batem: preço unitário e preço total.");
    }

    return 1
  }
}

module.exports = PurchaseValidation