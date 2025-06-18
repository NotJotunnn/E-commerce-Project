const { Router } = require("express");
const UserController = require("../controllers/userController");

const router = Router()

router
  .get("/usuario", UserController.pegarUsers)
  .post("/usuario", UserController.cadastrarUser)
  .get("/usuario/id/:id", UserController.pegarUserPorId)
  .put("/usuario/id/:id", UserController.atualizarUser)
  .delete("/usuario/id/:id", UserController.deletarUser)

module.exports = router