const bodyParser = require("body-parser")
const products = require("./productRoutes")
const users = require("./userRoute")
const permissions = require("./permissionRoutes")

// TODO rota user_permissions

module.exports = app => {
  app.use(
    bodyParser.json(),
    products,
    users,
    permissions,
  )
}