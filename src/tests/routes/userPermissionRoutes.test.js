const { beforeAll, afterAll, describe, it, expect } = require("@jest/globals");
const app = require("../..");
const request = require("supertest");
const UserService = require("../../services/userServices");
const PermissionService = require("../../services/PermissionServices");
const UserPermissionService = require("../../services/userPermissionServices");
const AuthService = require("../../services/authServices");

require("dotenv").config();

let server;
let mockUserPermission;
let adminAuthToken;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

beforeAll(async () => {
  adminAuthToken = await AuthService.login({ email: "demo@admin.com", password: "HORSE HORSE TEST CHICKEN"})

  const newUser = await UserService.cadastrar({
    name: "Carlos",
    email: "Carlos2@carlos.com",
    hash: "123123123",
    phone_number: "61988888814",
  });

  const newPermission = await PermissionService.cadastrar({
    name: "Create Create Permissions",
    description: "Allows the creation to create permissions.",
  });

  mockUserPermission = {
    user_id: newUser.id,
    permission_id: newPermission.id,
  };
});

afterAll(async () => {
  await UserService.deletar(mockUserPermission.user_id);
  await PermissionService.deletar(mockUserPermission.permission_id);
});

afterAll(() => {
  server.close();
});

describe("Testing userPermission routes", () => {
  it("Testing GET /usuario-permissao", async () => {
    await request(app)
      .get("/usuario-permissao")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .expect(200)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Permissões pegas com sucesso.");
        expect(data.data.length).toBeGreaterThan(0)
      });
  });

  it("Testing POST /usuario-permissao", async () => {
    await request(app)
      .post("/usuario-permissao")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .send(mockUserPermission)
      .expect(201)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Cadastro de permissão feito com sucesso.");
        expect(data.data).toEqual(
          expect.objectContaining({
            ...mockUserPermission,
          })
        );
      });
  });

  it("Testing POST /usuario-permissao/batch", async () => {
    await UserPermissionService.deletar(mockUserPermission)
    const batchPermissions = (await PermissionService.pegar())
      .map((permission) => permission.id)
      .filter((permission) => permission != mockUserPermission.permission_id);
    
    batchPermissions.push(mockUserPermission.permission_id)

    await request(app)
      .post("/usuario-permissao/batch")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .send({
        user_id: mockUserPermission.user_id,
        permissionsArray: batchPermissions,
      })
      .expect(201)
      .then((data) => data.body)
      .then((data) => {
        expect(data.message).toBe("Permissões cadastradas com sucesso.");
        expect(data.data.length).toBeGreaterThan(0);
        expect(data.data[data.data.length - 1]).toEqual(
          expect.objectContaining({
            ...mockUserPermission,
          })
        );
      });
  });

  it("Testing GET /usuario-permissao/user-id/:user_id", async () => {
    await request(app)
      .get(`/usuario-permissao/user-id/${mockUserPermission.user_id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Permissões pegas com sucesso.")
        expect(data.data.length).toBeGreaterThan(0)
        expect(data.data.find(permission => permission.permission_id == mockUserPermission.permission_id)).toEqual(
          expect.objectContaining({
            ...mockUserPermission,
            name: "Create Create Permissions",
            description: "Allows the creation to create permissions."
          })
        )
      })
  })

  it("Testing GET /usuario-permissao/user-id/:user_id/permission-id/:permission_id", async () => {
    await request(app)
      .get(`/usuario-permissao/user-id/${mockUserPermission.user_id}/permission-id/${mockUserPermission.permission_id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Permissão pega com sucesso.")
        expect(data.data).toEqual(
          expect.objectContaining({
            ...mockUserPermission,
          })
        )
      })
  })

  it("Testing DELETE /usuario-permissao/user-id/:user_id/permission-id/:permission_id", async () => {
    await request(app)
      .delete(`/usuario-permissao/user-id/${mockUserPermission.user_id}/permission-id/${mockUserPermission.permission_id}`)
      .set("Accept", "application.json")
      .set("Authorization", `Bearer ${adminAuthToken}`)
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Permissão deletadas com sucesso.")
      })
  })
});
