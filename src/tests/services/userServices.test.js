const Database = require("../../Knex/database");
const { afterAll, describe, it, expect, beforeEach } = require("@jest/globals");
const UserService = require("../../services/userServices");
const UserServiceDebug = require("../../utils/UserServiceDebug");
const { v4: uuidV4 } = require("uuid")

beforeEach(async () => {
  const mockUserDataIdArray = await UserServiceDebug.pegarPorEmail(
    "test2@test.com"
  );

  const demoEmail = await UserServiceDebug.pegarPorEmail("demo@test.com");

  await UserService.atualizar(demoEmail[0].id, { name: "demo" });

  for (const userDataId of mockUserDataIdArray) {
    await UserService.deletar(userDataId.id);
  }
});

afterAll(() => {
  Database.destroy();
});

describe("Testing UserService class", () => {
  const mockUser = {
    name: "Teste",
    hash: "123123123",
    email: "test2@test.com",
    phone_number: "+55 (61) 988888888",
  };

  it("Testing cadastrar method, should return a new user", async () => {
    const newUser = await UserService.cadastrar(mockUser);

    expect(newUser).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        phone_number: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
    expect(newUser.hash).toBeUndefined();
  });

  it.each([
    ["Empty", {}],
    ["Name", { ...mockUser, name: "" }],
    ["Hash", { ...mockUser, hash: "" }],
    ["Email", { ...mockUser, email: "" }],
    ["PhoneNumber", { ...mockUser, phone_number: "" }],
  ])(
    "Testing cadastrar method, should return a generic error, step %s",
    async (name, mockUser) => {
      const newUser = UserService.cadastrar(mockUser);

      await expect(newUser).rejects.toThrow(
        "Campos 'name', 'senha', 'email', 'phone_number' são necessários."
      );
    }
  );

  it("Testing cadastrar method, should return a hash error", async () => {
    const newUser = UserService.cadastrar({ ...mockUser, hash: "123" });

    await expect(newUser).rejects.toThrow(
      "Senha deve ser maior que 8 caracteres."
    );
  });

  it.each([
    [
      "Email already in use",
      { ...mockUser, email: "demo@test.com" },
      "Email já utilizado.",
    ],
    [
      "Non conventional email",
      { ...mockUser, email: "testest" },
      "Email não convencional, seu email deve contar 1 @, 1 domínio e 1 domínio top.",
    ],
  ])(
    "Testing cadastrar method, should return an email error, step %s",
    async (name, mockUser, errorMessage) => {
      const newUser = UserService.cadastrar(mockUser);

      await expect(newUser).rejects.toThrow(errorMessage);
    }
  );

  it.each([
    [
      "Phone number already in use",
      { ...mockUser, phone_number: "5561988888888" },
      "Número de celular já utilizado.",
    ],
    [
      "Non conventional phone number",
      { ...mockUser, phone_number: "5561988888881" },
      "Número de celular não convencional, seu número deve conter 1 código de país (opcional), 1 código de estado (opcional), 9 extra (opcional), número.",
    ],
  ])(
    "Testing cadastrar method, should return a phone error, step %s",
    async (name, mockUser, errorMessage) => {
      const newUser = UserService.cadastrar(mockUser);

      await expect(newUser).rejects.toThrow(errorMessage);
    }
  );

  it("Testing pegar method, should return an array of users without hashes", async () => {
    const users = await UserService.pegar();

    expect(users.length).toBeGreaterThan(0);
    expect(users[0].hash).toBeUndefined();
  });

  it("Testing pegarPorId method, should return an user without hash", async () => {
    const users = await UserService.pegar();
    const user = await UserService.pegarPorId(users[0].id);

    expect(user.id).toEqual(users[0].id);
    expect(user.hash).toBeUndefined();
  });

  it("Testing atualizar method, should return an updated user wihout hash", async () => {
    const users = await UserService.pegar();
    const user = await UserService.atualizar(users[0].id, { name: "Carlos" });

    expect(user.name).toEqual("Carlos");
    expect(user.name).not.toEqual(users[0].name);
    expect(user.hash).toBeUndefined();
  });

  it.each([
    ["Email already in use", { email: "demo@test.com" }, "Email já utilizado."],
    [
      "Non conventional email",
      { email: "testest" },
      "Email não convencional, seu email deve contar 1 @, 1 domínio e 1 domínio top.",
    ],
  ])(
    "Testing atualizar method, should return an email error, step %s",
    async (name, mockUser, errorMessage) => {
      const user = await UserService.pegar();
      const newUser = UserService.atualizar(user[0].id, mockUser);

      await expect(newUser).rejects.toThrow(errorMessage);
    }
  );

  it.each([
    [
      "Phone number already in use",
      { phone_number: "5561988888888" },
      "Número de celular já utilizado.",
    ],
    [
      "Non conventional phone number",
      { phone_number: "5561988888881" },
      "Número de celular não convencional, seu número deve conter 1 código de país (opcional), 1 código de estado (opcional), 9 extra (opcional), número.",
    ],
  ])(
    "Testing atualizar method, should return a phone error, step %s",
    async (name, mockUser, errorMessage) => {
      const user = await UserService.pegar();
      const newUser = UserService.atualizar(user[0].id, mockUser);

      await expect(newUser).rejects.toThrow(errorMessage);
    }
  );

  it("Testing deletar method", async () => {
    const newUser = await UserService.cadastrar(mockUser)
    await UserService.deletar(newUser.id)

    const userExist = UserService.pegarPorId(newUser.id)

    await expect(userExist).rejects.toThrow("Não foi possível pegar usuário por id: Usuário não cadastrado.")
  })

  it("Testing deletar method, should return an error", async () => {
    const deleteUser = UserService.deletar(uuidV4())

    await expect(deleteUser).rejects.toThrow("Não foi possível deletar usuário: Usuário não cadastrado.")
  })
});
