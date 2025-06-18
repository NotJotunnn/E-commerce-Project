const { hash } = require("bcryptjs")
const Database = require("../Knex/database")
const { v4: uuidV4 } = require("uuid")

class UserService {
  static async cadastrar(dto) {
    try {
      if(!dto || !dto.name || !dto.hash || !dto.email || !dto.phone_number) throw new Error("Campos 'name', 'senha', 'email', 'phone_number' são necessários.")
      
      const newHash = await hash(dto.hash, 10)
      const id = uuidV4()
      
      const userAlreadyExists = await Database("users")
        .where("email", dto.email)
        .first();

      if (userAlreadyExists) throw new Error("Usuário já cadastrado.");

      await Database("users").insert({id, ...dto, hash: newHash})

      return await Database("users").where("id", id).first()
    } catch (err) {
      throw new Error(`Não foi possível cadastrar um novo usuário: ${err.message}`)
    }
  }

  static async pegar() {
    try {
      return await Database("users")
    } catch (err) {
      throw new Error(`Não foi possível pegar usuários: ${err.message}`)
    }
  }

  static async pegarPorId(id) {
    try {
      if(!id) throw new Error("Id não incluso.")
      const user = await Database("users").where("id", id).first()

      if(!user) throw new Error("Usuário não cadastrado.")

      return user
    } catch (err) {
      throw new Error(`Não foi possível pegar usuário: ${err.message}`)
    }
  }

  static async atualizar(id, dto) {
    try {
      if(!id) throw new Error("Id não incluso.")

      const userFound = await Database("users").where("id", id).first()

      if(!userFound) throw new Error("Usuário não cadastrado.")
      
      return await Database("users").where("id", id).update(dto)
    } catch (err) {
      throw new Error(`Não foi possível atualizar usuário: ${err.message}`)
    }
  }

  static async deletar(id) {
    try {
      if(!id) throw new Error("Id não incluso.")

      const userFound = await Database("users").where("id", id).first()

      if(!userFound) throw new Error("Usuário não cadastrado.")

      await Database("users").where("id", id).del()
      
      return
    } catch (err) {
      throw new Error(`Não foi possível deletar usuário: ${err.message}`)
    }
  }
}

module.exports = UserService