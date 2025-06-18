const { Router } = require("express");
const PermissionController = require("../controllers/permissionController");

const router = Router()

router
  .get("/permission", PermissionController.pegarPermissoes)
  .post("/permission", PermissionController.cadastrarPermissao)
  .get("/permission/id/:id", PermissionController.pegarPermissaoPorId)
  .put("/permission/id/:id", PermissionController.atualizarPermissao)
  .delete("/permission/id/:id", PermissionController.deletarPermissao)