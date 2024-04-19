const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { Product } = require("../models");
const { product1 } = require("./utils/data/product.data");
let ProductById = null;
describe("#GET /api/product/", () => {
  beforeEach(async () => {
    await Product.sync({ force: true });
  });
  it("should return an empty array", async () => {
    const response = await request(app).get("/products/").send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual([]);
  });
});

describe("#POST /api/product/", () => {
  it("should create a new product", async () => {
    const response = await request(app)
      .post("/products/")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(product1);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toEqual("El producto fue creado con éxito!");
  });
});

describe("#GET /api/product/:id", () => {
  it("should return a Product", async () => {
    const response = await request(app).get(`/products/${1}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
  });
});
