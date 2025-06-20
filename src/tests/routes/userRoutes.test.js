const { describe, beforeAll, afterAll, it, expect } = require("@jest/globals");
const request = require("supertest");
const app = require("../..");
require("dotenv").config();

let server;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

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
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuários pegos com sucesso.");
        expect(data.data.length).toBeGreaterThan(0);
      });
  });

  it("Testing route POST /usuarios", async () => {
    // eslint-disable-next-line no-unused-vars
    const { hash, ...publicData } = mockUser;

    await request(app)
      .post("/usuarios")
      .set("Accept", "application/json")
      .send(mockUser)
      .expect(201)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário criado com sucesso.");
        expect(data.data).toStrictEqual(
          expect.objectContaining({
            ...publicData,
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          })
        );
        mockUser.id = data.data.id;
      });
  });

  it("Testing route GET /usuarios/id/:id", async () => {
    await request(app)
      .get(`/usuarios/id/${mockUser.id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário pego por id com sucesso.");
        expect(data.data).not.toBeUndefined();
      });
  });

  it("Testing route PUT /usuarios/id/:id", async () => {
    await request(app)
      .put(`/usuarios/id/${mockUser.id}`)
      .set("Accept", "application/json")
      .send({ name: mockUser.name })
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário atualizado com sucesso.");
        expect(data.data.name).toBe("Teste");
      });
  });

  it("Testing route DELETE /usuarios/id/:id", async () => {
    await request(app)
      .delete(`/usuarios/id/${mockUser.id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Usuário deletado com sucesso.");
      });
  });
});
