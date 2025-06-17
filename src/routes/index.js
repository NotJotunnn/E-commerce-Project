const bodyParser = require("body-parser")
const products = require("./productRoutes")

module.exports = app => {
  app.use(
    bodyParser.json(),
    products
  )
}