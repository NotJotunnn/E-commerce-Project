const { Router } = require("express");
const UserController = require("../controllers/userController");

const router = Router()

router
  .get("/user", UserController.pegarUsers)
  .post("/user", UserController.cadastrarUser)
  .get("/user/id/:id", UserController.pegarUserPorId)
  .put("/user/id/:id", UserController.atualizarUser)
  .delete("/user/id/:id", UserController.deletarUser)

module.exports = router