const auth = require("./authMiddleware");
const permissions = require("./permissionsMiddleware");

module.exports = {
  auth,
  permissions
}