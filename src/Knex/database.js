const Knexfile = require("../../knexfile");
const Database = require("knex")(Knexfile);

module.exports = Database;
