const { Router } = require("express");
const UserPermissionController = require("../controllers/userPermissionController");

const router = Router()

router
  .get("/usuario-permissao", UserPermissionController.pegarPermissoes)
  .post("/usuario-permissao", UserPermissionController.cadastrarPermissao)
  .post("/usuario-permissao/batch", UserPermissionController.cadastrarPermissaoBatch)
  .get("/usuario-permissao/user-id/:user_id", UserPermissionController.pegarPermissoesPorUserId)
  .get("/usuario-permissao/user-id/:user_id/permission-id/:permission_id", UserPermissionController.pegarPermissoesPorId)
  .delete("/usuario-permissao/user-id/:user_id/permission-id/:permission_id", UserPermissionController.deletarPermissao)

module.exports = router