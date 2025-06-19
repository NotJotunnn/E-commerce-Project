const { describe, beforeAll, afterAll, it, expect, afterEach } = require("@jest/globals")
const request = require("supertest");
const app = require("../..");
const UserServiceDebug = require("../../utils/UserServiceDebug");
const UserService = require("../../services/userServices");
require("dotenv").config()

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

afterEach(async () => {
  const mockUser = await UserServiceDebug.pegarPorEmail("test2@test.com")

  if(mockUser && mockUser.length > 0) {
    await UserService.deletar(mockUser[0].id)
  }
})

afterAll(async () => {
  await UserService.cadastrar({
    name: "demo", 
    hash: "HORSE HORSE TEST CHICKEN",
    email: "demo@test.com",
    phone_number: "61988888888",
  })
})

afterAll(() => {
  server.close();
});

describe("Testing user routes", () => {
  const mockUser = {
    name: "Teste",
    hash: "123123123",
    email: "test2@test.com",
    phone_number: "+55 (61) 988888888",
  };

  it("Testing route GET /usuarios", async () => {
    await request(app)
      .get("/usuarios")
      .set("Accept", "application/json")
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Usuários pegos com sucesso.")
        expect(data.body.data.length).toBeGreaterThan(0)
      })
  })

  it("Testing route POST /usuarios", async () => {
    // eslint-disable-next-line no-unused-vars
    const { hash, ...publicData } = mockUser

    await request(app)
      .post("/usuarios")
      .set("Accept", "application/json")
      .send(mockUser)
      .expect(201)
      .then(data => {
        expect(data.body.message).toBe("Usuário criado com sucesso.")
        expect(data.body.data).toStrictEqual(expect.objectContaining({
          ...publicData,
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }))
      })
  })

  it("Testing route GET /usuarios/id/:id", async () => {
    const users = await UserService.pegar()

    await request(app)
      .get(`/usuarios/id/${users[0].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Usuário pego por id com sucesso.")
        expect(data.body.data).not.toBeUndefined()
      })
  })

  it("Testing route PUT /usuarios/id/:id", async () => {
    const users = await UserService.pegar()

    await request(app)
      .put(`/usuarios/id/${users[0].id}`)
      .set("Accept", "application/json")
      .send({ name: mockUser.name })
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Usuário atualizado com sucesso.")
        expect(data.body.data.name).toBe("Teste")
      })
  })

  it("Testing route DELETE /usuarios/id/:id", async () => {
    const users = await UserService.pegar()

    await request(app)
      .delete(`/usuarios/id/${users[0].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Usuário deletado com sucesso.")
      })
  })
})