const { v4: uuidV4 } = require("uuid");

class Product {
  constructor(title, price, currency, rating) {
    const fieldValidations = [
      { name: "title", value: title },
      { name: "price", value: price },
      { name: "currency", value: currency },
      { name: "rating", value: rating },
    ];

    for (const { name, value } of fieldValidations) {
      if (value == null || value.trim() === "") {
        throw new Error(`Campo "${name}" não foi incluído.`);
      }
    }

    this.id = uuidV4();
    this.title = title;
    this.price = price;
    this.currency = currency;
    this.rating = rating;
  }
}

module.exports = Product;
