const { beforeAll, afterAll, describe, it, expect } = require("@jest/globals");
const app = require("../..");
const request = require("supertest");
const { PermissionServiceDebug } = require("../../utils");
const AuthService = require("../../services/authServices");

let server;
let authToken;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

beforeAll(async () => {
  authToken = await AuthService.login({ email: "demo@admin.com", password: "HORSE HORSE TEST CHICKEN" })
});

afterAll(() => {
  server.close();
});

describe("Testing permission Routes", () => {
  const mockPermission = {
    name: "Create Users",
    description: "Can create users"
  }

  it("Testing GET /permissoes", async () => {
    await request(app)
      .get("/permissoes")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Permissões pegas com sucesso.")
        expect(data.body.data.length).toBeGreaterThan(0)
      })
  })

  it("Testing POST /permissoes", async () => {
    await request(app)
      .post("/permissoes")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send(mockPermission)
      .expect(201)
      .then(data => {
        expect(data.body.message).toBe("Permissão cadastrada com sucesso.")
        expect(data.body.data).toEqual(expect.objectContaining({
          id: expect.any(Number),
          ...mockPermission,
        }))
      })
  })

  it("Testing GET /permissoes/id/:id", async () => {
    const permission = await PermissionServiceDebug.pegarPorName(mockPermission.name)

    await request(app)
      .get(`/permissoes/id/${permission[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Permissão pega por id com sucesso.")
        expect(data.body.data).toEqual(expect.objectContaining({
          id: expect.any(Number),
          ...mockPermission,
        }))
      })
  })

  it("Testing PUT /permissoes/id/:id", async () => {
    const permission = await PermissionServiceDebug.pegarPorName(mockPermission.name)

    await request(app)
      .put(`/permissoes/id/${permission[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send({...mockPermission, name: "Create Carro"})
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Permissão atualizada com sucesso.")
        expect(data.body.data).toEqual(expect.objectContaining({
          id: expect.any(Number),
          ...mockPermission,
          name: "Create Carro"
        }))
      })
  })

  it("Testing DELETE /permissoes/id/:id", async () => {
    const permission = await PermissionServiceDebug.pegarPorName("Create Carro")

    await request(app)
      .delete(`/permissoes/id/${permission[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then(data => {
        expect(data.body.message).toBe("Permissão deletada com sucesso.")
      })
  })
})