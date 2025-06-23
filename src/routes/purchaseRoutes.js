const { Router } = require("express");
const { auth, permissions } = require("../middleware");
const PurchaseController = require("../controllers/purchaseController");

const router = Router();

router
  .get("/history", auth, PurchaseController.pegarComprasPorUserId)
  .post("/history", auth, PurchaseController.cadastrarCompra)
  .get("/history/global", auth, permissions(["Read"]), PurchaseController.pegarComprasGlobais)
  .put("/history/id/:id", auth, PurchaseController.atualizarCompra);

module.exports = router;
