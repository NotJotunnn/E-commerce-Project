const bodyParser = require("body-parser");
const products = require("./productRoutes");
const users = require("./userRoutes");
const permissions = require("./permissionRoutes");
const userPermissions = require("./userPermissionsRoutes");

module.exports = (app) => {
  app.use(bodyParser.json(), products, users, permissions, userPermissions);
};
