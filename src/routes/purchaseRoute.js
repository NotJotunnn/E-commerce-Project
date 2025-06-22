const { Router } = require("express");
const { auth, permissions } = require("../middleware");
const PurchaseController = require("../controllers/purchaseController");

const router = Router();

router
  .get("/history", auth, permissions(["Read"]), PurchaseController.pegarComprasGlobais)
  .post("/history", auth, PurchaseController.cadastrarCompra)
  .get("/history/user", auth, PurchaseController.pegarComprasPorUserId)
  .put("/history/id/:id", auth, PurchaseController.atualizarCompra);

module.exports = router;
