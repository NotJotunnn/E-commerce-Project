const { Router } = require("express");
const PermissionController = require("../controllers/permissionController");

const router = Router()

router
  .get("/permissoes", PermissionController.pegarPermissoes)
  .post("/permissoes", PermissionController.cadastrarPermissao)
  .get("/permissoes/id/:id", PermissionController.pegarPermissaoPorId)
  .put("/permissoes/id/:id", PermissionController.atualizarPermissao)
  .delete("/permissoes/id/:id", PermissionController.deletarPermissao)

module.exports = router