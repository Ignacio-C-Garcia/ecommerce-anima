const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { Product, Category } = require("../models");
const { product1 } = require("./utils/data/product.data");
let ProductById = null;

beforeAll(async () => {
  await Product.sync({ force: true });
  await Category.bulkCreate([{ name: "salado" }, { name: "dulce" }]);
});

describe("#GET /api/product/", () => {
  it("should return an empty array", async () => {
    const response = await request(app).get("/products/").send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual([]);
  });

  it("should return a list with one product", async () => {
    const productdb = await Product.create(product1);
    const response = await request(app).get("/products/").send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body[0].id).toEqual(productdb.id);
  });
});

describe("#POST /products/", () => {
  it("should create a new product", async () => {
    const response = await request(app)
      .post("/products/")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(product1)
      .expect(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product created successfully");
    expect(await Product.findByPk(response.body.product.id)).not.toBeNull();
  });
});

describe("#GET /products/:id", () => {
  it("should return a Product", async () => {
    await Product.sync({ force: true });
    await Product.create(product1);
    const response = await request(app).get(`/products/${1}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product found");
    expect(response.body.product.id).toEqual(1);
    expect(await Product.findByPk(1)).not.toBeNull();
  });
});

describe("#PATCH /products/:id", () => {
  it("Should update and return modified Product", async () => {
    await Product.sync({ force: true });
    await Product.create(product1);
    const newData = {
      
    }
    const response = await request(app).Patch(`/products/${1}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product updated");
    expect(response.body.product.id).toEqual(1);
    expect(await Product.findByPk(1)).not.toBeNull();
  });
});