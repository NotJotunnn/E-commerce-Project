const { Router } = require("express");
const ProductController = require("../controllers/productController");
const { auth } = require("../middleware");

const router = Router();

router
  .get("/produtos", ProductController.pegarPaginado)
  .post("/produtos", auth, ProductController.cadastrarProduto)
  .get("/produtos/id/:id", ProductController.pegarProdutoPorId)
  .put("/produtos/id/:id", auth, ProductController.atualizarProduto)
  .delete("/produtos/id/:id", auth, ProductController.deletarProduto);

module.exports = router;
