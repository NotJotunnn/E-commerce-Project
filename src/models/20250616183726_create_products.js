/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary();
    table.string("title").notNullable();
    table.string("price").notNullable();
    table.string("currency").notNullable();
    table.string("rating").notNullable();
    table.integer("quantity").notNullable();
    table.boolean("availability").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
