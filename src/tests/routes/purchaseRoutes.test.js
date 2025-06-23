const { beforeAll, afterAll, describe, it, expect } = require("@jest/globals");
const app = require("../..");
const AuthService = require("../../services/authServices");
const request = require("supertest");
const UserService = require("../../services/userServices");
const ProductService = require("../../services/productServices");
require("dotenv").config();

let server;
let user
let product
let mockPurchase
let adminToken;
let userToken;

beforeAll(() => {
  server = app.listen(
    process.env.PORT,
    () => `servidor está rodando na porta ${process.env.PORT}`
  );
});

beforeAll(async () => {
  user = await UserService.cadastrar({
    name: "Carlos Silva",
    hash: "123123123",
    email: "CarlosS2@gmail.com",
    phone_number: "61988885555"
  })

  product = await ProductService.cadastrar({
    title: "Carro7",
    price: 1000,
    currency: "BRL",
    rating: "5.0/5",
    quantity: 8,
    availability: true
  })

  mockPurchase = {
    user_id: user.id,
    product_id: product.id,
    price_per_unit: 1000,
    quantity: 3,
    total_price: 3000,
    payment_method: "PIX",
  }

  adminToken = await AuthService.login({
    email: "demo@admin.com",
    password: "HORSE HORSE TEST CHICKEN",
  });

  userToken = await AuthService.login({
    email: "CarlosS2@gmail.com",
    password: "123123123",
  });
});

afterAll(async () => {
  await UserService.deletar(user.id)
  await ProductService.deletar(product.id)
})

afterAll(() => {
  server.close();
});

describe("Testing purchase routes", () => {
  it("POST /history", async () => {
    await request(app)
      .post("/history")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userToken}`)
      .send({...mockPurchase})
      .expect(201)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Compra cadastrada com sucesso")
        expect(data.data.user_id).toBe(user.id)

        mockPurchase.id = data.data.id
      })
  })

    it("GET /history", async () => {
    await request(app)
      .get("/history")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Compras pegas com sucesso.")
        expect(data.data[0].user_id).toBe(user.id)
        expect(data.data.length).toBeGreaterThan(0)
      })
  })

    it("GET /history/global", async () => {
    await request(app)
      .get("/history/global")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Compras pegas com sucesso.")
        expect(data.data.length).toBeGreaterThan(0)
      })
  })

    it("PUT /history", async () => {
    await request(app)
      .put(`/history/id/${mockPurchase.id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ status: "Successful" })
      .expect(200)
      .then(data => data.body)
      .then(data => {
        expect(data.message).toBe("Compra atualizada com sucesso")
      })
  })
})
