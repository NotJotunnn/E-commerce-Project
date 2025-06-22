const { Router } = require("express");
const UserPermissionController = require("../controllers/userPermissionController");
const { auth, permissions } = require("../middleware");

const router = Router()

router
  .get("/usuario-permissao", auth, permissions(["Read Permissions"]), UserPermissionController.pegarPermissoes)
  .post("/usuario-permissao", auth, permissions(["Create Permissions"]), UserPermissionController.cadastrarPermissao)
  .post("/usuario-permissao/batch", auth, permissions(["Create Permissions"]), UserPermissionController.cadastrarPermissaoBatch)
  .get("/usuario-permissao/user-id/:user_id", auth, permissions(["Read Permissions"]), UserPermissionController.pegarPermissoesPorUserId)
  .get("/usuario-permissao/user-id/:user_id/permission-id/:permission_id", auth, permissions(["Read Permissions"]), UserPermissionController.pegarPermissoesPorId)
  .delete("/usuario-permissao/user-id/:user_id/permission-id/:permission_id", auth, permissions(["Delete Permissions"]), UserPermissionController.deletarPermissao)

module.exports = router