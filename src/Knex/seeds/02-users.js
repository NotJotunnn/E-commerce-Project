/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const { v4: uuidV4 } = require("uuid")

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      id: uuidV4(),
      name: "demo",
      hash: "f8851d18c99e426fc1f75edd85e45947fa2ea05256dad0a04e0d8cd1c599be93d10be2b6b5ca618de21b3d8a55bde33e0b683ba2beda7f8d467f516eacc74db5",
      email: "demo@test.com",
      phone_number: "5561988888888"
    }
  ]);
};
