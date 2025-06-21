const { Router } = require("express");
const UserController = require("../controllers/userController");
const { auth, permissions } = require("../middleware");

const router = Router()

router
  .get("/usuarios", auth, permissions(["Read"]), UserController.pegarUsers)
  .post("/usuarios", UserController.cadastrarUser)
  .get("/usuarios/id/:id", auth, UserController.pegarUserPorId)
  .put("/usuarios/id/:id", auth, UserController.atualizarUser)
  .delete("/usuarios/id/:id", auth, UserController.deletarUser)

module.exports = router