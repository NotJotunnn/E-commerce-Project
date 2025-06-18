const ProductServices = require("../services/productServices");

class ProductController {
  static async cadastrarProduto(req, res) {
    const { id, title, price, currency, rating, quantity } = req.body;

    try {
      const product = await ProductServices.cadastrar({
        id,
        title,
        price,
        currency,
        rating,
        quantity,
      });

      res
        .status(201)
        .send({ message: "Produto cadastrado com sucesso.", data: product });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarProdutos(_, res) {
    try {
      const products = await ProductServices.pegar();

      res
        .status(200)
        .send({ message: "Produtos pegos com sucesso.", data: products });
    } catch (err) {
      res.status(400).send({ message: err.message, data: {} });
    }
  }

  static async pegarPaginado(req, res) {
    const { limit = 30, page = 1 } = req.query;

    const resultsLimit = Math.min(parseInt(limit), 80);
    const pageCounter = Math.max(parseInt(page), 1);

    try {
      const products = await ProductServices.pegarPaginado(
        resultsLimit,
        pageCounter
      );

      res
        .status(200)
        .send({
          message: "Resultados pegos com sucesso.",
          page: pageCounter,
          limit: resultsLimit,
          data: products,
        });
    } catch (err) {
      res
        .status(400)
        .send({
          message: err.message,
          page: pageCounter,
          limit: resultsLimit,
          data: {},
        });
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

      res.status(200).send({
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
