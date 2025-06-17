const { Router } = require("express");
const ProductController = require("../controllers/productController");

const router = Router();

router
  .get("/produtos", ProductController.pegarProdutos)
  .post("/produtos", ProductController.cadastrarProduto)
  .get("/produtos/id/:id", ProductController.pegarProdutoPorId)
  .put("/produtos/id/:id", ProductController.atualizarProduto)
  .delete("/produtos/id/:id", ProductController.deletarProduto);

module.exports = router;
