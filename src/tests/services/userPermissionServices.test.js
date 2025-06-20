const { afterAll, describe, it, beforeAll, expect } = require("@jest/globals");
const Database = require("../../Knex/database");
const UserService = require("../../services/userServices");
const UserServiceDebug = require("../../utils/UserServiceDebug");
const PermissionService = require("../../services/PermissionServices");
const UserPermissionService = require("../../services/userPermissionServices");

beforeAll(async () => {
  await UserService.cadastrar({
    name: "Carlos",
    email: "Carlos@carlos.com",
    phone_number: "61988888887",
    hash: "123123123"
  })
})

afterAll(async () => {
  const userId = (await UserServiceDebug.pegarPorEmail("Carlos@carlos.com"))[0].id

  await UserService.deletar(userId)
})

afterAll(() => {
  Database.destroy();
});

describe("Testing UserPermissionService class", () => {
  it("Testing cadastrar method", async () => {
    const userId = (await UserServiceDebug.pegarPorEmail("Carlos@carlos.com"))[0].id
    const permissionId = (await PermissionService.pegar())[0].id

    const userPermission = await UserPermissionService.cadastrar({ user_id: userId, permission_id: permissionId })

    expect(userPermission).toEqual(expect.objectContaining({
      user_id: userId,
      permission_id: permissionId
    }))
  })

  it("Testing cadastrar method, should return a generic error", async () => {
    const userPermission = UserPermissionService.cadastrar()

    await expect(userPermission).rejects.toThrow("Não foi possível conceder permissão: Id de usuário e id Permissão são obrigatórios.")
  })

  it("Testing pegar method", async () => {
    const userPermission = await UserPermissionService.pegar()

    expect(userPermission.length).toBeGreaterThan(0)
  })

  it("Testing pegarPeloId method", async () => {
    const userId = (await UserServiceDebug.pegarPorEmail("Carlos@carlos.com"))[0].id
    const permissionId = (await PermissionService.pegar())[0].id

    const userPermission = await UserPermissionService.pegarPorId(userId, permissionId)

    expect(userPermission).toEqual(expect.objectContaining({
      user_id: userId,
      permission_id: permissionId
    }))
  })

  it("Testing pegarPeloId method, should return a generic error", async () => {
    const userPermission = UserPermissionService.pegarPorId()

    await expect(userPermission).rejects.toThrow("Não foi possível pegar permissão por id: user_id é obrigatório.")
  })

  it("Testing deletar method", async () => {
    const userId = (await UserServiceDebug.pegarPorEmail("Carlos@carlos.com"))[0].id
    const permissionId = (await PermissionService.pegar())[0].id

    await UserPermissionService.deletar({ user_id: userId, permission_id: permissionId})

    const deletedUserPermission = UserPermissionService.pegarPorId(userId, permissionId)

    await expect(deletedUserPermission).rejects.toThrow("Não foi possível pegar permissão por id: Permissão não encontrada")
  })

  it("Testing deletar method, should return a generic error", async () => {
    const deleteError = UserPermissionService.deletar()

    await expect(deleteError).rejects.toThrow("Não foi possível deletar permissão: Id de usuário e permissão obrigatórios.")
  })
})