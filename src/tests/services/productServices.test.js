const { describe, it, expect, afterEach } = require("@jest/globals");
const ProductServices = require("../../services/productServices");
const Database = require("../../Knex/database");

afterAll(() => {
  Database.destroy();
});

describe("Testing productServices class.", () => {
  const debugProduct = {
    title: "Carro",
    price: "1.000",
    currency: "BRL",
    rating: "5.0/5",
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
  ])(
    "Testing cadastrar method lacking %s parameter, should return an error",
    async (name, product) => {
      const newProduct = ProductServices.cadastrar(product);

      await expect(newProduct).rejects.toThrow(
        `Não foi possível cadastrar dessa vez: Campo "${name}" não foi incluído.`
      );
    }
  );

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
  ])(
    "Testing atualizar method, should return an updated object with updated %s parameter.",
    async (name, updatedProductValues) => {
      const products = await ProductServices.pegar();

      const product = await ProductServices.pegarPorId(
        products[products.length - 1].id
      );

      const updatedProduct = await ProductServices.atualizar(product.id, {
        ...product,
        ...updatedProductValues,
      });

      expect(updatedProduct).toEqual(
        expect.objectContaining({
          ...product,
          ...updatedProductValues,
        })
      );
      expect(updatedProduct).not.toStrictEqual(product);
    }
  );

  it("Testing atualizar method, should return an error.", async () => {
    const products = await ProductServices.pegar();

    const updatedProduct = ProductServices.atualizar("123", {
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
      products[products.length - 1].id
    );

    expect(product).toEqual("Produto deletado com sucesso.");
  });

  it("Testing deletar method, should return an error", async () => {
    const product = ProductServices.deletar("123");

    await expect(product).rejects.toThrow(
      "Não foi possível deletar dessa vez: Produto não cadastrado."
    );
  });
});
