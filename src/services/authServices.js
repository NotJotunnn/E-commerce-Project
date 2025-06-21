const { compare } = require("bcryptjs");
const Database = require("../Knex/database");
const { secret } = require("../config/jsonSecret");
const { sign } = require("jsonwebtoken");

class AuthService {
  static async login(dto) {
    const { email, password } = dto;

    try {
      if (!email || !password)
        throw new Error("Email e/ou senha não incluídos.");

      const userFound = await Database("users")
        .select("id", "email", "hash")
        .where({
          email,
        })
        .first();

      if (!userFound) throw new Error("Usuário não cadastrado.");

      const correctPassword = await compare(password, userFound.hash);

      if (!correctPassword) throw new Error("Usuário ou senha incorretos.");

      const accessToken = sign(
        {
          id: userFound.id,
          email: userFound.email,
        },
        secret,
        {
          expiresIn: "8W",
        }
      );

      return accessToken;
    } catch (err) {
      throw new Error(`Não foi possível logar: ${err.message}`);
    }
  }
}

module.exports = AuthService;
