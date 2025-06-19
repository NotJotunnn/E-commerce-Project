const { Router } = require("express");
const UserController = require("../controllers/userController");

const router = Router()

router
  .get("/usuarios", UserController.pegarUsers)
  .post("/usuarios", UserController.cadastrarUser)
  .get("/usuarios/id/:id", UserController.pegarUserPorId)
  .put("/usuarios/id/:id", UserController.atualizarUser)
  .delete("/usuarios/id/:id", UserController.deletarUser)

module.exports = router