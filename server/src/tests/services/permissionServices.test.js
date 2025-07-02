const { afterAll, describe, it, expect } = require("@jest/globals");
const Database = require("../../Knex/database");
const PermissionService = require("../../services/PermissionServices");

afterAll(() => {
  Database.destroy();
});

describe("Testing PermissionService class", () => {
  const mockPermission = {
    name: "Create users",
    description: "Can create new users",
  };

  it("Testing cadastrar method", async () => {
    const newPermission = await PermissionService.cadastrar(mockPermission);

    expect(newPermission).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...mockPermission,
      })
    );
  });

  it.each([
    ["Name", { ...mockPermission, name: "" }],
    ["Description", { ...mockPermission, description: "" }],
  ])("Testing cadastrar method, should return a generic error, step %s", async (name, mockPermission) => {
    const newPermission = PermissionService.cadastrar(mockPermission);

    await expect(newPermission).rejects.toThrow("Não foi possível cadastrar uma permissão nova: Campos 'name', 'description' são necessários.")
  });

  it("Testing pegar method", async () => {
    const permissions = await PermissionService.pegar();

    expect(permissions.length).toBeGreaterThan(0);
  });

  it("Testing pegarPorId method", async () => {
    const permissions = await PermissionService.pegar();

    const permission = await PermissionService.pegarPorId(permissions[0].id);

    expect(permission).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
      })
    );
  });

  it.each([
    ["Empty", null, "Não foi possível pegar uma permissão por id: Id não incluso."],
    ["Wrong Id", 1000000, "Não foi possível pegar uma permissão por id: Permissão não cadastrada."],
  ])("Testing pegarPorId method, should return an error, step %s", async (name, id, error) => {
    const permission = PermissionService.pegarPorId(id);

    await expect(permission).rejects.toThrow(error)
  });

  it("Testing atualizar method", async () => {
    const permissions = await PermissionService.pegar();

    const permission = await PermissionService.atualizar(
      permissions[permissions.length - 1].id,
      mockPermission
    );

    expect(permission).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        ...mockPermission,
      })
    );
  });

  it.each([
    ["Empty", null, "Não foi possível atualizar uma permissão: Id não incluso."],
    ["Wrong Id", 1000000, "Não foi possível atualizar uma permissão: Permissão não cadastrada."],
  ])("Testing atualizar method, should return an error, step %s", async (name, id, error) => {
    const permission = PermissionService.atualizar(id);

    await expect(permission).rejects.toThrow(error)
  });

  it("Testing deletar method", async () => {
    const permissions = await PermissionService.pegar();

    await PermissionService.deletar(permissions[permissions.length - 1].id);

    const permissionIsFound = PermissionService.pegarPorId(
      permissions[permissions.length - 1].id
    );

    expect(permissionIsFound).rejects.toThrow("Não foi possível pegar uma permissão por id: Permissão não cadastrada.")
  });

  it.each([
    ["Empty", null, "Não foi possível deletar uma permissão: Id não incluso."],
    ["Wrong Id", 1000000, "Não foi possível deletar uma permissão: Permissão não cadastrada."],
  ])("Testing deletar method, should return an error, step %s", async (name, id, error) => {
    const permission = PermissionService.deletar(id);

    await expect(permission).rejects.toThrow(error)
  });
});
