/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const fs = require("fs")
const rawData = fs.readFileSync('./src/Knex/seed.json');
const products = JSON.parse(rawData);

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert(products);
};