const { describe, it, expect, afterAll, beforeAll } = require("@jest/globals");
const ProductServices = require("../../services/productServices");
const Database = require("../../Knex/database");
const { v4: uuidV4 } = require("uuid");
const ProductServiceDebug = require("../../utils/productServiceDebug");

afterAll(() => {
  Database.destroy();
});

beforeAll(async () => {
  const mockData = await ProductServiceDebug.pegarPorTitle("Carro5")

  for(const mockItem of mockData) {
    await ProductServices.deletar(mockItem.id)
  }
}, 5000)

describe("Testing productServices class.", () => {
  const debugProduct = {
    title: "Carro5",
    price: "1.000",
    currency: "BRL",
    rating: "5.0/5",
    quantity: 10,
    availability: true,
  };

  it("Testing cadastrar method, should return a new product object", async () => {
    const newProduct = await ProductServices.cadastrar(debugProduct);

    expect(newProduct).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...debugProduct,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
  });

  it.each([
    ["title", { ...debugProduct, title: "" }],
    ["price", { ...debugProduct, price: "" }],
    ["currency", { ...debugProduct, currency: "" }],
    ["rating", { ...debugProduct, rating: "" }],
    ["quantity", { ...debugProduct, quantity: 0 }],
    ["availability", { ...debugProduct, availability: null }],
  ])(
    "Testing cadastrar method lacking %s parameter, should return an error",
    async (name, product) => {
      const newProduct = ProductServices.cadastrar(product);

      await expect(newProduct).rejects.toThrow(
        `Não foi possível cadastrar dessa vez: Campos 'title', 'price', 'currency', 'rating', 'quantity', 'availability' não podem estar vazios.`
      );
    }
  );

  // TODO alterar/adicionar método de pegar paginado e testar as queries
  it("Testing pegar method, should return at least an array with one value.", async () => {
    const products = await ProductServices.pegar();

    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        price: expect.any(String),
        currency: expect.any(String),
        rating: expect.any(String),
        quantity: expect.any(Number),
        availability: expect.any(Boolean),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
  });

  it("Testing pegarPorId method, should return an object.", async () => {
    const products = await ProductServices.pegar();

    const product = await ProductServices.pegarPorId(products[0].id);

    expect(product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        price: expect.any(String),
        currency: expect.any(String),
        rating: expect.any(String),
        quantity: expect.any(Number),
        availability: expect.any(Boolean),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    );
  });

  it.each([
    ["title", { title: "Carro2" }],
    ["price", { price: "2.000" }],
    ["currency", { currency: "USD" }],
    ["rating", { rating: "0.0/5" }],
    ["quantity", { quantity: 0 }],
    ["availability", { availability: false }],
  ])(
    "Testing atualizar method, should return an updated object with updated %s parameter.",
    async (name, updatedProductValues) => {
      const products = await ProductServices.pegar();

      const { id, title, price, currency, rating, quantity, availability } = await ProductServices.pegarPorId(
        products[0].id
      );

      const product = {
        title, price, currency, rating, quantity, availability
      }

      const updatedProduct = await ProductServices.atualizar(id, {
        ...product,
        ...updatedProductValues,
      });

      expect(updatedProduct).toEqual(
        expect.objectContaining({
          ...product,
          ...updatedProductValues,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      );
      expect(updatedProduct).not.toStrictEqual(product);
    }
  );

  it("Testing atualizar method, should return an error.", async () => {
    const products = await ProductServices.pegar();

    const updatedProduct = ProductServices.atualizar(uuidV4(), {
      ...products[0],
      title: "Carro2",
    });

    await expect(updatedProduct).rejects.toThrow(
      "Não foi possível atualizar dessa vez: Produto não cadastrado."
    );
  });

  it("Testing deletar method, should return a string", async () => {
    const products = await ProductServices.pegar();

    const product = await ProductServices.deletar(
      products[0].id
    );

    expect(product).toEqual("Produto deletado com sucesso.");
  });

  it("Testing deletar method, should return an error", async () => {
    const product = ProductServices.deletar(uuidV4());

    await expect(product).rejects.toThrow(
      "Não foi possível deletar dessa vez: Produto não cadastrado."
    );
  });
});
