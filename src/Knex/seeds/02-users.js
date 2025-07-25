/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const { hash } = require("bcryptjs");
const { v4: uuidV4 } = require("uuid")

exports.seed = async function(knex) {
  const password = await hash("HORSE HORSE TEST CHICKEN", 10);

  await knex('users').del()
  // ? Admin pov
  await knex('users').insert([
    {
      id: uuidV4(),
      name: "demo",
      hash: password,
      email: "demo@admin.com",
      phone_number: "61988888888"
    }
  ]);
  // ? User pov
  await knex('users').insert([
    {
      id: uuidV4(),
      name: "demo",
      hash: password,
      email: "demo@test.com",
      phone_number: "61988888844"
    }
  ]);
};
