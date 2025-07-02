const { Router } = require("express");
const ProductController = require("../controllers/productController");
const { auth, permissions } = require("../middleware");

const router = Router();

router
  .get("/produtos", ProductController.pegarPaginado)
  .post("/produtos", auth, permissions(["Create"]), ProductController.cadastrarProduto)
  .get("/produtos/id/:id", ProductController.pegarProdutoPorId)
  .put("/produtos/id/:id", auth, permissions(["Update"]),  ProductController.atualizarProduto)
  .delete("/produtos/id/:id", auth, permissions(["Delete"]), ProductController.deletarProduto);

module.exports = router;
