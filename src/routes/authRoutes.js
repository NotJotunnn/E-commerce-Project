const { Router } = require("express");
const AuthController = require("../controllers/authController");

const router = Router()

router
  .post("/auth/login", AuthController.userLogin)

module.exports = router