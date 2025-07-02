const Database = require("../Knex/database");

class UserValidation {
  static async validarDados(dto) {
    if (dto.hash) {
      if (dto.hash.length < 8)
        throw new Error("Senha deve ser maior que 8 caracteres.");
    }

    if (dto.email) {
      const emailExists = await Database("users")
        .select("email")
        .where("email", dto.email)
        .first();

      if (emailExists) throw new Error("Email já utilizado.");
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(dto.email))
        throw new Error(
          "Email não convencional, seu email deve contar 1 @, 1 domínio e 1 domínio top."
        );
    }

    if (dto.phone_number) {
      const phoneNumberExists = await Database("users")
        .select("phone_number")
        .where("phone_number", dto.phone_number)
        .first();

      const phoneNumberRegex =
      // eslint-disable-next-line no-useless-escape
      /^(\+55\s?)?(\(?\d{2}\)?)?\s?(9?\s?\d{4}[-\.\s]?\d{4})$/;

      if (phoneNumberExists !== undefined)  
        throw new Error("Número de celular já utilizado.");

      else if (!phoneNumberRegex.test(dto.phone_number))
        throw new Error(
          "Número de celular não convencional, seu número deve conter 1 código de país (opcional), 1 código de estado (opcional), 9 extra (opcional), número."
        );
    }

    return 1;
  }
}

module.exports = UserValidation;
