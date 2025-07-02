const { afterAll, describe, beforeAll, it, expect } = require("@jest/globals");
const Database = require("../../Knex/database");
const UserService = require("../../services/userServices");
const ProductService = require("../../services/productServices");
const { v4: uuidV4 } = require("uuid");
const PurchaseService = require("../../services/purchaseServices");

let user
let product
let mockPurchase

beforeAll(async () => {
  user = await UserService.cadastrar({
    name: "Carlos Silva",
    hash: "123123123",
    email: "CarlosS@gmail.com",
    phone_number: "61988888855"
  })
  product = await ProductService.cadastrar({
    title: "Carro16",
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
})

afterAll(async () => {
  await ProductService.deletar(product.id)
  await UserService.deletar(user.id)
})

afterAll(() => {
  Database.destroy()
})

describe("Testing PurchaseService class", () => {
  it("Testing pegar method", async () => {
    const purchases = await PurchaseService.pegar()

    expect(purchases.length).toBeGreaterThan(0)
  })

  it("Testing cadastrar method", async () => {
    const newPurchase = await PurchaseService.cadastrar(mockPurchase)

    expect(newPurchase).toEqual(expect.objectContaining({
      id: expect.any(String),
      ...mockPurchase,
      status: "Pending",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }))

    mockPurchase.id = newPurchase.id
  })

  it.each([
    ["missing data on dto", { user_id: "" }, "Campos 'user_id' 'product_id' 'total_price' 'price_per_unit' 'payment_method' 'quantity' são necessários."],
    ["No user", { user_id: uuidV4() }, "Usuário não cadastrado."],
    ["No product", { product_id: uuidV4() }, "Produto não cadastrado."],
    ["Quantity too high", { quantity: 9 }, "Quantidade não pode ser mais que disponível."],
    ["Total price not achievable", { total_price: 1 }, "Não foi possível cadastrar uma nova compra: Valores não batem: preço unitário e preço total."],
    ["Unit price different than product unit price", { price_per_unit: 1 }, "Preço do produto não bate com o registrado."],
  ])("Testing cadastrar method, should return an error, step %s", async (name, updatedMock, error) => {
    const newPurchase = PurchaseService.cadastrar({...mockPurchase, ...updatedMock})

    await expect(newPurchase).rejects.toThrow(error)
  })

  it("Testing pegarPorId method", async () => {
    const purchase = await PurchaseService.pegarPorId(mockPurchase.id)

    expect(purchase).toEqual(expect.objectContaining({
      id: expect.any(String),
      ...mockPurchase,
      status: "Pending",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }))
  })

  it.each([
    ["Id not included", { id: null }, "Id não incluso."],
    ["Purchase not registered", { id: uuidV4() }, "Compra não registrada."],
  ])("Testing pegarPorId method, should return an error, step %s", async (name, purchaseData, error) => {
    const purchase = PurchaseService.pegarPorId(purchaseData.id)

    await expect(purchase).rejects.toThrow(error)
  })

  it("Testing pegarPorUserId method", async () => {
    const purchases = await PurchaseService.pegarPorUserId(user.id)

    expect(purchases[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      ...mockPurchase,
      status: "Pending",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }))
  })

  it.each([
    ["userId not included", { id: "" }, "Id de usuário não incluso."],
    ["User not registered", { id: uuidV4() }, "Usuário não cadastrado."],
  ])("Testing pegarPorUserId method, step %s", async (name, userData, error) => {
    const purchases = PurchaseService.pegarPorUserId(userData.id)

    await expect(purchases).rejects.toThrow(error)
  })

  it("Testing atualizar method", async () => {
    const updatedPurchase = await PurchaseService.atualizar(mockPurchase.id, {
      status: "Successful"
    })

    expect(updatedPurchase).toEqual(expect.objectContaining({
      id: expect.any(String),
      ...mockPurchase,
      status: "Successful",
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    }))
  })

  it.each([
    ["Id not included", { id: "" }, {}, "Não foi possível atualizar compra: Id não incluso."],
    ["Purchase not registered", { id: uuidV4() }, {}, "Compra não cadastrada."],
    ["Zeroed unit price", {}, { price_per_unit: 0 }, "Preço unitário não pode ser nulo."],
    ["Zeroed total price", {}, { total_price: 0 }, "Preço total não pode ser nulo."],
  ])("Testing atualizar method, should return an error, step %s", async (name, purchaseData, purchaseUpdatedData, error) => {
    const updatedPurchase = PurchaseService.atualizar(purchaseData.id || name == "Id not included" ? purchaseData.id : mockPurchase.id, purchaseUpdatedData)

    expect(updatedPurchase).rejects.toThrow(error)
  })
})