const bodyParser = require("body-parser");
const products = require("./productRoutes");
const users = require("./userRoutes");
const permissions = require("./permissionRoutes");
const userPermissions = require("./userPermissionsRoutes");
const purchase = require("./purchaseRoutes")
const auth = require("./authRoutes");

module.exports = (app) => {
  app.use(
    bodyParser.json(),
    products,
    users,
    purchase,
    auth,
    permissions,
    userPermissions
  );
};
