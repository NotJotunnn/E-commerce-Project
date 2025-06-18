const { Router } = require("express");
const PermissionController = require("../controllers/permissionController");

const router = Router()

router
  .get("/permissao", PermissionController.pegarPermissoes)
  .post("/permissao", PermissionController.cadastrarPermissao)
  .get("/permissao/id/:id", PermissionController.pegarPermissaoPorId)
  .put("/permissao/id/:id", PermissionController.atualizarPermissao)
  .delete("/permissao/id/:id", PermissionController.deletarPermissao)

module.exports = router