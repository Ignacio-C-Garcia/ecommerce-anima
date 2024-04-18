const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const productSeeder = require("../seeders/productSeeder");
const { Product } = require("../models");
const { product1 } = require("./utils/data/product.data");

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
