const { beforeAll, afterAll, describe, it } = require("@jest/globals");
const app = require("../..");
const request = require("supertest")

// TODO Finish userPermissionRoutes.test.js

require("dotenv").config()

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});


afterAll(() => {
  server.close();
});

describe("Testing userPermission routes", () => {
  it("Testing GET /usuario-permissao route")
})