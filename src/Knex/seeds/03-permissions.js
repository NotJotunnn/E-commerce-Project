/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("permissions").del();
  await knex("permissions").insert([
    { name: "Create", description: "Permission to create" },
    { name: "Read", description: "Permission to read" },
    { name: "Update", description: "Permission to update" },
    { name: "Delete", description: "Permission to delete" },
    { name: "Create Permissions", description: "Permission to create permissions" },
    { name: "Read Permissions", description: "Permission to read permissions" },
    { name: "Update Permissions", description: "Permission to update permissions" },
    { name: "Delete Permissions", description: "Permission to delete permissions" },
  ]);
};
