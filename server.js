const app = require("./src");
require("dotenv").config()

const port = process.env.PORT || 8000

app.listen(port, () =>
  console.log(`servidor está rodando na porta ${port}`)
);