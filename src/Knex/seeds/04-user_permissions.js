/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("user_permissions").del();

  const demoUser = await knex("users").where("email", "demo@admin.com").first();
  if (!demoUser) throw new Error("Demo user not found.");

  const permissions = await knex("permissions").select("*");

  if (permissions.length == 0) throw new Error("Permissions not found.");

  const userPermissionsArray = [];

  for (const permission of permissions) {
    userPermissionsArray.push({
      user_id: demoUser.id,
      permission_id: permission.id,
    });
  }

  await knex("user_permissions").insert(userPermissionsArray);
};
