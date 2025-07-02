const PurchaseService = require("../services/purchaseServices");

class PurchaseController {
  static async cadastrarCompra(req, res) {
    try {
      const { userId: user_id } = req;
      const { 
        product_id,
        total_price,
        price_per_unit,
        payment_method,
        quantity
       } = req.body

      const purchase = await PurchaseService.cadastrar({
        user_id,
        product_id,
        total_price,
        price_per_unit,
        payment_method,
        quantity,
      });

      res
        .status(201)
        .send({ message: "Compra cadastrada com sucesso", data: purchase });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarComprasGlobais(_, res) {
    try {
      const purchases = await PurchaseService.pegar()

      res.status(200).send({ message: "Compras pegas com sucesso.", data: purchases })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async pegarComprasPorUserId(req, res) {
    try {
      const { userId: user_id } = req;

      const purchases = await PurchaseService.pegarPorUserId(user_id)

      res.status(200).send({ message: "Compras pegas com sucesso.", data: purchases })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }

  static async atualizarCompra(req, res) {
    try {
      const { id } = req.params

      const updatedPurchase = await PurchaseService.atualizar(id, { ...req.body })

      res.status(200).send({ message: "Compra atualizada com sucesso", data: updatedPurchase })
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} })
    }
  }
}

module.exports = PurchaseController;
