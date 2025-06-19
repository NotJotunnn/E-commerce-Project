/* eslint-disable no-unused-vars */
const { hash: hashing } = require("bcryptjs");
const Database = require("../Knex/database");
const { v4: uuidV4 } = require("uuid");
const { UserValidation } = require("../utils");

class UserService {
  static async cadastrar(dto) {
    try {
      if (!dto || !dto.name || !dto.hash || !dto.email || !dto.phone_number)
        throw new Error(
          "Campos 'name', 'senha', 'email', 'phone_number' são necessários."
        );

      await UserValidation.validarDados(dto)

      const newHash = await hashing(dto.hash, 10);
      const id = uuidV4();

      await Database("users").insert({ id, ...dto, hash: newHash });

      const sanitizedUser = await Database("users").where("id", id).first();

      const { hash, ...publicData } = sanitizedUser;

      return publicData;
    } catch (err) {
      throw new Error(
        `Não foi possível cadastrar um novo usuário: ${err.message}`
      );
    }
  }

  static async pegar() {
    try {
      const noPasswordUsers = await Database("users");

      const publicUser = noPasswordUsers.map((user) => {
        const { hash, ...publicData } = user;
        return publicData;
      });

      return publicUser;
    } catch (err) {
      throw new Error(`Não foi possível pegar usuários: ${err.message}`);
    }
  }

  static async pegarPorId(id) {
    try {
      if (!id) throw new Error("Id não incluso.");
      const user = await Database("users").where("id", id).first();

      if (!user) throw new Error("Usuário não cadastrado.");

      const { hash, ...publicData } = user;

      return publicData;
    } catch (err) {
      throw new Error(`Não foi possível pegar usuário por id: ${err.message}`);
    }
  }

  static async atualizar(id, dto) {
    try {
      if (!id) throw new Error("Id não incluso.");

      if(dto && dto.hash) {
        const { hash, ...publicData } = dto
        dto = publicData
      }

      await UserValidation.validarDados(dto)

      const userFound = await Database("users").where("id", id).first();

      if (!userFound) throw new Error("Usuário não cadastrado.");

      await Database("users").where("id", id).update(dto);

      const user = await Database("users").where("id", id).first();

      const { hash, ...publicData } = user;

      return publicData;
    } catch (err) {
      throw new Error(`Não foi possível atualizar usuário: ${err.message}`);
    }
  }

  static async deletar(id) {
    try {
      if (!id) throw new Error("Id não incluso.");

      const userFound = await Database("users").where("id", id).first();

      if (!userFound) throw new Error("Usuário não cadastrado.");

      await Database("users").where("id", id).del();

      return;
    } catch (err) {
      throw new Error(`Não foi possível deletar usuário: ${err.message}`);
    }
  }
}

module.exports = UserService;
