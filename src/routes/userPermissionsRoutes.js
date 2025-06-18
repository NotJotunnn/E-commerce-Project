const { Router } = require("express");
const UserPermissionController = require("../controllers/userPermissionController");

const router = Router()

router
  .get("/usuario-permissao", UserPermissionController.pegarPermissoes)
  .post("/usuario-permissao", UserPermissionController.cadastrarPermissao)
  .post("/usuario-permissao/batch", UserPermissionController.cadastrarPermissaoBatch)
  .get("/usuario-permissao/id:id", UserPermissionController.pegarPermissaoPorId)
  .put("/usuario-permissao/id:id", UserPermissionController.atualizarPermissao)
  .delete("/usuario-permissao/id:id", UserPermissionController.deletarPermissao)

module.exports = router