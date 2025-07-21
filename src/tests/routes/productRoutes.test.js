/* eslint-disable no-undef */
const { beforeAll, afterAll, describe, it } = require("@jest/globals");
const app = require("../../index");
const request = require("supertest");
const ProductService = require("../../services/productServices");
const { v4: uuidV4 } = require("uuid");
const { ProductServiceDebug } = require("../../utils");
const AuthService = require("../../services/authServices");
require("dotenv").config();

let server;
let authToken;

beforeAll(() => {
  server = app.listen(process.env.PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.PORT}`)
  );
});

beforeAll(async () => {
  const mockData = await ProductServiceDebug.pegarPorTitle("Carro5")

  for(const mockItem of mockData) {
    await ProductService.deletar(mockItem.id)
  }

  authToken = await AuthService.login({ email: "demo@admin.com", password: "HORSE HORSE TEST CHICKEN" })
})

afterAll(() => {
  server.close();
});

describe("Testing Product routes", () => {
  const productMock = {
    title: "Carro5",
    price: 1000,
    currency: "BRL",
    rating: "5.0/5",
    quantity: 10,
    availability: true,
  };

  // TODO atualizar para utilizar queries
  it("Testing GET /produtos", async () => {
    await request(app)
      .get("/produtos")
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Produtos pegos com sucesso.");
        expect(response.body.data.length).toBeGreaterThan(0);
        expect(response.body.data[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            price: expect.any(Number),
            currency: expect.any(String),
            rating: expect.any(String),
            quantity: expect.any(Number),
            availability: expect.any(Boolean),
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });

  it("Testing POST /produtos", async () => {
    await request(app)
      .post("/produtos")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send(productMock)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Produto cadastrado com sucesso."
        );
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            price: expect.any(Number),
            currency: expect.any(String),
            rating: expect.any(String),
            quantity: expect.any(Number),
            availability: expect.any(Boolean),
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });

  it.each([
    ["Title", { ...productMock, title: "" }],
    ["Price", { ...productMock, price: 0 }],
    ["Currency", { ...productMock, currency: "" }],
    ["Rating", { ...productMock, rating: "" }],
    ["Quantity", { ...productMock, quantity: 0 }],
  ])(
    "Testing POST /produtos, should return an error, step %s",
    async (name, productValue) => {
      await request(app)
        .post("/produtos")
        .set("Accept", "application/json")
        .set("Authorization", `Bearer ${authToken}`)
        .send(productValue)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            `Não foi possível cadastrar dessa vez: Campos 'title', 'price', 'currency', 'rating', 'quantity', 'availability' não podem estar vazios.`
          );
        });
    }
  );

  it("Testing GET /produtos/id", async () => {
    const product = await ProductService.pegar();

    await request(app)
      .get(`/produtos/id/${product[0].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Produto pego por id com sucesso."
        );
        expect(response.body.data).toEqual(
          expect.objectContaining({
            ...product[0],
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });

  it("Testing GET /produtos/id, should return an error", async () => {
    await request(app)
      .get(`/produtos/id/${uuidV4()}`)
      .set("Accept", "application/json")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Não foi possível pegar por id dessa vez: Produto não cadastrado."
        );
      });
  });

  it("Testing PUT /produtos/id", async () => {
    const productMock = {
      title: "Carro",
      price: 1000,
      currency: "BRL",
      rating: "5.0/5",
      quantity: 10,
      availability: true,
    };

    const product = await ProductService.pegar();

    await request(app)
      .put(`/produtos/id/${product[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send(productMock)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Produto atualizado com sucesso");
        expect(response.body.data).toEqual(
          expect.objectContaining({
            id: product[0].id,
            ...productMock,
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });

  it("Testing PUT /produtos/id, should return an error", async () => {
    await request(app)
      .put(`/produtos/id/${uuidV4()}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("Não foi possível atualizar dessa vez: Produto não cadastrado.");
      });
  });

  it("Testing DELETE /produtos/id", async () => {
    const product = await ProductService.pegar();

    await request(app)
      .delete(`/produtos/id/${product[0].id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Produto deletado com sucesso");
      });
  });

  it("Testing DELETE /produtos/id, should return an error", async () => {
    await request(app)
      .delete(`/produtos/id/${uuidV4()}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("Não foi possível deletar dessa vez: Produto não cadastrado.");
      });
  });
});