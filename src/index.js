const express = require("express");
const routes = require("./routes");
require("dotenv").config();

const app = express();

routes(app);

app.listen(process.env.PORT, () =>
  console.log(`servidor está rodando na porta ${process.env.PORT}`)
);

module.exports = app;
