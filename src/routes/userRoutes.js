const { Router } = require("express");
const UserController = require("../controllers/userController");
const { auth, permissions } = require("../middleware");

const router = Router();

// TODO Update both getUserById and updateUser to only allow the user thats logged in
// TODO Maybe make a version of the route where admins can access via dashboard
router
  .get("/usuarios", auth, permissions(["Read"]), UserController.pegarUsers)
  .post("/usuarios", UserController.cadastrarUser)
  .get("/usuarios/id/:id", auth, UserController.pegarUserPorId)
  .put("/usuarios/id/:id", auth, UserController.atualizarUser)
  .delete("/usuarios/id/:id", auth, UserController.deletarUser);

module.exports = router;
