/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const rawData = require("../backup/seed.json");

exports.seed = async function (knex) {
  const products = rawData.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating,
    currency: product.currency,
    availability: product.availability,
    quantity: product.quantity,
    image_filename: product.image_filename,
  }));

  await knex("products").del();
  await knex.batchInsert("products", products, 100);
};
