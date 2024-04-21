const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { Product, Category, sequelize } = require("../models");
const { product1, product2 } = require("./utils/data/product.data");

beforeAll(async () => {
  await sequelize.sync({ force: true });

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
  beforeEach(async () => {
    await Product.sync({ force: true });
    await Product.create(product1);
  });
  it("Should not update none of product's atributes", async () => {
    const testObj = {
      name: "",
      description: "",
      price: -1,
      stock: -1,

      featured: 12,
      pic: "",
      categoryId: 20,
    };
    const response = await request(app).patch(`/products/${1}`).send(testObj);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product not updated");
    expect(response.body.errors).not.toBeNull();

    const productInDB = await Product.findByPk(1);

    expect(productInDB.name).toBe(product1.name);
    expect(productInDB.stock).toBe(product1.stock);
    expect(productInDB.featured).toBe(product1.featured);
    expect(productInDB.description).toBe(product1.description);
    expect(productInDB.price).toBe(product1.price);
    expect(productInDB.pic).toBe(product1.pic);
    expect(productInDB.categoryId).toBe(product1.categoryId);
  });
  it("Should update some atributes of a Product", async () => {
    const testObj = { name: "newName", stock: 0, featured: false };
    const response = await request(app).patch(`/products/${1}`).send(testObj);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product updated");
    expect(response.body.product.id).toEqual(1);
    expect(await Product.findByPk(1)).not.toBeNull();

    const product = response.body.product;

    expect(product.name).toBe(testObj.name);
    expect(product.stock).toBe(testObj.stock);
    expect(product.featured).toBe(testObj.featured);

    expect(product.description).toBe(product1.description);
    expect(product.price).toBe(product1.price);
    expect(product.pic).toBe(product1.pic);
    expect(product.categoryId).toBe(product1.categoryId);
  });

  it("Should update all atributes of a Product", async () => {
    const response = await request(app).patch(`/products/${1}`).send(product2);
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.message).toEqual("Product updated");
    expect(response.body.product.id).toEqual(1);
    expect(await Product.findByPk(1)).not.toBeNull();

    const product = response.body.product;

    expect(product.name).toBe(product2.name);
    expect(product.description).toBe(product2.description);
    expect(product.price).toBe(product2.price);
    expect(product.stock).toBe(product2.stock);
    expect(product.featured).toBe(product2.featured);
    expect(product.pic).toBe(product2.pic);
    expect(product.categoryId).toBe(product2.categoryId);
    expect(product.createdAt).not.toBe(product2.createdAt);
    expect(product.updatedAt).not.toBe(product2.updatedAt);
  });
});
