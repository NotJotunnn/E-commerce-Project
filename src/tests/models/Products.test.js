const { describe, it, expect } = require("@jest/globals");
const Product = require("../../models/Products");

describe("Testing Class Product", () => {
  const product = {
    title: "Carro",
    price: "1.000",
    currency: "BRL",
    rating: "5.0/5",
  };

  it("Should create an object with an id.", () => {
    const newProduct = new Product(
      product.title,
      product.price,
      product.currency,
      product.rating
    );

    expect({ ...newProduct }).toEqual({
      id: expect.any(String),
      ...product,
    });
  });

  it.each([
    ["title", { ...product, title: "" }],
    ["price", { ...product, price: "" }],
    ["currency", { ...product, currency: "" }],
    ["rating", { ...product, rating: "" }],
  ]) ("Should return false when creating an with missing %s parameter.", (name, productValue) => {
    const createInvalidProduct = () => {
      return new Product(
        productValue.title,
        productValue.price,
        productValue.currency,
        productValue.rating
      );
    };

    // Test for the synchronous error
    expect(createInvalidProduct).toThrow(`Campo "${name}" não foi incluído.`);
  });
});
