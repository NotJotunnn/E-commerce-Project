/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary();
    table.string("title").notNullable();
    table.float("price").notNullable();
    table.string("currency").notNullable();
    table.string("rating").notNullable();
    table.integer("quantity").notNullable();
    table.boolean("availability").notNullable();
    table.string("image_filename").nullable();
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
