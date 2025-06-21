const Database = require("../Knex/database");

const permissions = (permissionsArray) => {
  return async (req, res, next) => {
    const { userId } = req;

    try {
      const userPermissions = await Database("user_permissions")
      .where("user_permissions.user_id", userId)
      .join("permissions", "user_permissions.permission_id", "permissions.id")
      .select("name");

      const userEnable = userPermissions.map(permission => permission.name).some(permission => permissionsArray.includes(permission))

      if(!userEnable) return res.status(401).send({ message: "Usuário não possui permissão para acessar essa rota.", data: {} });

      return next()
    } catch (err) {
      res.status(401).send({ message: err.message, data: {} })
    }
  };
};

module.exports = permissions;
