const { beforeAll, afterAll, describe, it } = require("@jest/globals");
const app = require("../../index");
const request = require("supertest");
const ProductServices = require("../../services/productServices");
require("dotenv").config();

let server;

beforeAll(() => {
  server = app.listen(process.env.TEST_PORT, () =>
    console.log(`servidor está rodando na porta ${process.env.TEST_PORT}`)
  );
});

afterAll(() => {
  server.close();
});

describe("Testing Product routes", () => {
  const productMock = {
    title: "Carro",
    price: "1.000",
    currency: "BRL",
    rating: "5.0/5",
  };

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
            price: expect.any(String),
            currency: expect.any(String),
            rating: expect.any(String),
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
            price: expect.any(String),
            currency: expect.any(String),
            rating: expect.any(String),
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });

  it.each([
    ["Title", { ...productMock, title: "" }],
    ["Price", { ...productMock, price: "" }],
    ["Currency", { ...productMock, currency: "" }],
    ["Rating", { ...productMock, rating: "" }],
  ])(
    "Testing POST /produtos, should return an error, step %s",
    async (name, productValue) => {
      await request(app)
        .post("/produtos")
        .set("Accept", "application/json")
        .send(productValue)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            `Não foi possível cadastrar dessa vez: Campo "${name.toLowerCase()}" não foi incluído.`
          );
        });
    }
  );

  it("Testing GET /produtos/id", async () => {
    const product = await ProductServices.pegar();

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
      .get(`/produtos/id/123`)
      .set("Accept", "application/json")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual(
          "Não foi possível pegar por id dessa vez: Produto não cadastrado."
        );
      });
  });

  it("Testing PUT /produtos/id", async () => {
    const product = await ProductServices.pegar();

    await request(app)
      .put(`/produtos/id/${product[0].id}`)
      .set("Accept", "application/json")
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
      .put(`/produtos/id/123`)
      .set("Accept", "application/json")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("Não foi possível atualizar dessa vez: Produto não cadastrado.");
      });
  });

  it("Testing DELETE /produtos/id", async () => {
    const product = await ProductServices.pegar();

    await request(app)
      .delete(`/produtos/id/${product[0].id}`)
      .set("Accept", "application/json")
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual("Produto deletado com sucesso");
      });
  });

  it("Testing DELETE /produtos/id, should return an error", async () => {
    await request(app)
      .delete(`/produtos/id/123`)
      .set("Accept", "application/json")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual("Não foi possível deletar dessa vez: Produto não cadastrado.");
      });
  });
});