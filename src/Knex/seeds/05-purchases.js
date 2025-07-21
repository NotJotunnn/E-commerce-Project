/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { v4: uuidV4 } = require("uuid")

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("purchases").del();

  const products = await knex("products").where("quantity", ">", 5);
  const user_id = (await knex("users").where({ email: "demo@test.com" }).first()).id;

  for(const product of products) {
    const newQuantity = product.quantity - 3
    await knex("products").where({ id: product.id }).update({ quantity: newQuantity })

    const randomNumber = Math.round(Math.random() * 3)
    const randomNumber2 = Math.round(Math.random() * 3)

    await knex("purchases").insert({
      id: uuidV4(),
      user_id,
      product_id: product.id,
      price_per_unit: product.price,
      total_price: product.price * 3,
      status: randomNumber == 0 ? "Pending" : randomNumber == 1 ? "Successful" : "Cancelled",
      payment_method: randomNumber2 == 0 ? "PIX" : randomNumber2 == 1 ? "CREDIT CARD" : "DEBIT CARD",
      quantity: 3
    })
  }
};
