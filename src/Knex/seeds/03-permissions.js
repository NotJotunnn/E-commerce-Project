/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("permissions").del();
  await knex("permissions").insert([
    { name: "Create", description: "Permission to create" },
    { name: "Read", description: "Permission to read" },
    { name: "Update", description: "Permission to update" },
    { name: "Delete", description: "Permission to delete" },
  ]);
};
