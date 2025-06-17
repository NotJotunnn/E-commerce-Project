const ProductServices = require("../services/productServices");

class ProductController {
  static async cadastrarProduto(req, res) {
    const { title, price, currency, rating } = req.body;

    try {
      const product = await ProductServices.cadastrar({
        title,
        price,
        currency,
        rating,
      });

      res
        .status(201)
        .send({ message: "Produto cadastrado com sucesso.", data: product });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarProdutos(req, res) {
    try {
      const products = await ProductServices.pegar();

      res
        .status(200)
        .send({ message: "Produtos pegos com sucesso.", data: products });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarProdutoPorId(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductServices.pegarPorId(id);

      res
        .status(200)
        .send({ message: "Produto pego por id com sucesso.", data: product });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async atualizarProduto(req, res) {
    const { id } = req.params;

    try {
      const updatedProduct = await ProductServices.atualizar(id, req.body);

      res
        .status(200)
        .send({
          message: "Produto atualizado com sucesso",
          data: updatedProduct,
        });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async deletarProduto(req, res) {
    const { id } = req.params;

    try {
      await ProductServices.deletar(id);

      res
        .status(200)
        .send({ message: "Produto deletado com sucesso", data: {} });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }
}

module.exports = ProductController;
