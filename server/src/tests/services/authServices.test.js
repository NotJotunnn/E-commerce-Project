const { afterAll, beforeAll, describe, expect, it } = require("@jest/globals");
const Database = require("../../Knex/database");
const UserService = require("../../services/userServices");
const AuthService = require("../../services/authServices");

let mockUser;

beforeAll(async () => {
  mockUser = await UserService.cadastrar({
    name: "Carlos",
    hash: "123123123",
    email: "Carlos@carlos.com",
    phone_number: "61988888884",
  });
});

afterAll(async () => {
  await UserService.deletar(mockUser.id);
});

afterAll(() => {
  Database.destroy();
});

describe("Testing AuthService class", () => {
  it("Testing login method", async () => {
    const logIn = await AuthService.login({ email: mockUser.email, password: "123123123" });
  
    expect(logIn).toEqual(expect.any(String))
  })

  it.each([
    ["Wrong email", { ...mockUser, email: "Carlos2@carlos.com" }, "Usuário não cadastrado."],
    ["Wrong password", { ...mockUser, password: "12312312" }, "Usuário ou senha incorretos."]
  ])("Testing login method, should return an error, step %s", async (name, mockUser, error) => {
    const logIn = AuthService.login({ email: mockUser.email || "Carlos@carlos.com", password: mockUser.password || "123123123" });
  
    await expect(logIn).rejects.toThrow(error)
  })
});
