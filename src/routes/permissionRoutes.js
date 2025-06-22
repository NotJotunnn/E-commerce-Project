const { Router } = require("express");
const PermissionController = require("../controllers/permissionController");
const { auth, permissions } = require("../middleware");

const router = Router();

router.use(auth);

router
  .get("/permissoes", auth, permissions("Read Permissions"), PermissionController.pegarPermissoes)
  .post("/permissoes", auth, permissions("Create Permissions"), PermissionController.cadastrarPermissao)
  .get("/permissoes/id/:id", auth, permissions("Read Permissions"), PermissionController.pegarPermissaoPorId)
  .put("/permissoes/id/:id", auth, permissions("Update Permissions"), PermissionController.atualizarPermissao)
  .delete("/permissoes/id/:id", auth, permissions("Delete Permissions"), PermissionController.deletarPermissao);

module.exports = router;
