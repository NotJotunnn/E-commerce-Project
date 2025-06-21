const request = require("supertest");
const app = require("../..");
const { beforeAll, afterAll, describe, it, expect } = require("@jest/globals");
const UserService = require("../../services/userServices");
const AuthService = require("../../services/authServices");
require("dotenv").config();

let server;
let mockUser;
let token;
let demoToken;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

beforeAll(async () => {
  mockUser = await UserService.cadastrar({
    name: "Carlos",
    hash: "123123123",
    email: "Carlos@carlos.com",
    phone_number: "61988888884",
  });

  demoToken = await AuthService.login({
    email: "demo@test.com",
    password: "HORSE HORSE TEST CHICKEN",
  });
});

afterAll(async () => {
  await UserService.deletar(mockUser.id);
});

afterAll(() => {
  server.close();
});

describe("Testing auth routes", () => {
  it("Testing POST /auth/login", async () => {
    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send({ email: mockUser.email, password: "123123123" })
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Login efetuado com sucesso.");
        expect(data.data).toEqual(
          expect.objectContaining({
            accessToken: expect.any(String),
          })
        );
        token = data.data.accessToken;
      });
  });

  it("Testing authentication middleware", async () => {
    await request(app)
      .get(`/usuarios/id/${mockUser.id}`)
      .set("Accept", "application.json")
      .set("Authorization", token)
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário pego por id com sucesso.");
        expect(data.data).toEqual(
          expect.objectContaining({
            ...mockUser,
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        );
      });
  });

  it("Testing authentication middleware, should return an error", async () => {
    await request(app)
      .get(`/usuarios/id/${mockUser.id}`)
      .set("Accept", "application.json")
      .expect(401)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário não autenticado.");
      });
  });

  it("Testing permissions middleware", async () => {
    await request(app)
      .get("/usuarios")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${demoToken}`)
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuários pegos com sucesso.");
        expect(data.data.length).toBeGreaterThan(0);
      });
  });

  it("Testing permissions middleware, should return an error", async () => {
    await request(app)
      .get("/usuarios")
      .set("Accept", "application/json")
      .set("Authorization", token)
      .expect(401)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe(
          "Usuário não possui permissão para acessar essa rota."
        );
      });
  });
});
