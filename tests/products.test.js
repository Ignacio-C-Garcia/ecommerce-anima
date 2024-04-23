const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { Product, Category, sequelize, User, Admin } = require("../models");
const {
  product1,
  product2,
  product3,
  product4,
  product5,
} = require("./utils/data/product.data");
let authToken;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Category.bulkCreate([{ name: "salado" }, { name: "dulce" }]);
  await Admin.create({
    surname: "admin",
    name: "admin",
    email: "admin@project.com",
    password: "admin",
  });
  const response = await request(app)
    .post("/tokens")
    .auth(authToken, { type: "bearer" })
    .send({
      email: "admin@project.com",
      password: "admin",
    });
  authToken = response.body.token;
});

describe("#GET /api/product/", () => {
  it("should return an empty array", async () => {
    const response = await request(app).get("/products/").send();

    const {
      statusCode,
      type: responseType,
      body: { products: obtainedProducts, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProducts).toEqual([]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with one product", async () => {
    await Product.create(product1);

    const response = await request(app).get("/products/").send();

    const {
      statusCode,
      type: responseType,
      body: { products: obtainedProducts, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toBe("application/json");
    expect(obtainedProducts).toMatchObject([product1]);

    expect(errors).toBeUndefined();
  });

  it("should return a list with two products", async () => {
    await Product.create(product2);

    const response = await request(app).get("/products/").send();

    const {
      statusCode,
      type: responseType,
      body: { products: obtainedProducts, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toBe("application/json");

    expect(obtainedProducts).toMatchObject([product1, product2]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with three products", async () => {
    await Product.create(product3);

    const response = await request(app).get("/products/").send();

    const {
      statusCode,
      type: responseType,
      body: { products: obtainedProducts, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toBe("application/json");

    expect(obtainedProducts).toMatchObject([product1, product2, product3]);
    expect(errors).toBeUndefined();
  });
});

describe("#GET /products/:id", () => {
  it("should return a Product (id=1)", async () => {
    const response = await request(app)
      .get(`/products/${1}`)
      .auth(authToken, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toMatchObject(product1);
    expect(errors).toBeUndefined();
  });

  it("should return a Product (id=2)", async () => {
    const response = await request(app)
      .get(`/products/${2}`)
      .auth(authToken, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toMatchObject(product2);
    expect(errors).toBeUndefined();
  });

  it("should return a Product (id=3)", async () => {
    const response = await request(app)
      .get(`/products/${3}`)
      .auth(authToken, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toMatchObject(product3);
    expect(errors).toBeUndefined();
  });

  it("should return null and error message (There is no product with the given id)", async () => {
    const response = await request(app)
      .get(`/products/${30}`)
      .auth(authToken, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Product not available");
  });

  it("should return null and error message (id doesn't valid)", async () => {
    const response = await request(app)
      .get(`/products/${-30}`)
      .auth(authToken, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Product not available");
  });
});

describe("#POST /products/", () => {
  it("should create a new product without an error", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send(product1);

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    const productFromDB = await Product.findByPk(obtainedProduct.id);
    expect(productFromDB).toMatchObject(product1);
    expect(obtainedProduct).toMatchObject(product1);
    expect(errors).toBeUndefined();
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ name: "pizza error" });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("description cannot be null");
    expect(errors).toContain("price cannot be null");
    expect(errors).toContain("stock cannot be null");
    expect(errors).toContain("featured cannot be null");
    expect(errors).toContain("pic cannot be null");
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ description: "it should return errors" });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("price cannot be null");
    expect(errors).toContain("stock cannot be null");
    expect(errors).toContain("featured cannot be null");
    expect(errors).toContain("pic cannot be null");
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ price: 10 });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("description cannot be null");
    expect(errors).toContain("stock cannot be null");
    expect(errors).toContain("featured cannot be null");
    expect(errors).toContain("pic cannot be null");
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ stock: 10 });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("description cannot be null");
    expect(errors).toContain("price cannot be null");
    expect(errors).toContain("featured cannot be null");
    expect(errors).toContain("pic cannot be null");
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ featured: true });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("description cannot be null");
    expect(errors).toContain("price cannot be null");
    expect(errors).toContain("stock cannot be null");
    expect(errors).toContain("pic cannot be null");
  });

  it("should not create a new product and return errors", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({ pic: true });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("description cannot be null");
    expect(errors).toContain("price cannot be null");
    expect(errors).toContain("featured cannot be null");
    expect(errors).toContain("stock cannot be null");
  });

  it("should not create a new product and return an error", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({
        description: "should return an error",
        price: 1,
        stock: 1,
        featured: false,
        pic: "photo",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("name cannot be null");
  });

  it("should not create a new product and return an error (invalid atribute)", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({
        name: "",
        description: "should return an error",
        price: 1,
        stock: 1,
        featured: false,
        pic: "photo",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("name cannot be empty");
  });

  it("should not create a new product and return an error (invalid atribute)", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({
        name: "should return an error",
        description: "",
        price: 1,
        stock: 1,
        featured: false,
        pic: "photo",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("description cannot be empty");
  });

  it("should not create a new product and return an error (invalid atributes)", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({
        name: "should return errors",
        description: "should return errors",
        price: -1,
        stock: -1,
        featured: 123,
        pic: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(4);
    expect(errors).toContain("pic cannot be empty");
    expect(errors).toContain("price must be a positive number");
    expect(errors).toContain("stock must be a positive number");
    expect(errors).toContain("featured must be true or false");
  });

  it("should not create a new product and return an error (invalid atributes)", async () => {
    const response = await request(app)
      .post("/products/")
      .auth(authToken, { type: "bearer" })
      .send({
        name: "should return errors",
        description: "should return errors",
        price: "should return errors",
        stock: "should return errors",
        featured: "should return errors",
        pic: "should return errors",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);
    expect(errors).toContain("price must be a positive number");
    expect(errors).toContain("stock must be a positive number");
    expect(errors).toContain("featured must be true or false");
  });
});

describe("#PATCH /products/:id", () => {
  beforeAll(async () => {
    await Product.sync({ force: true });
    await Product.create(product1);
  });

  it("Should not update none of product's atributes", async () => {
    const productBeforeTest = await Product.findByPk(1);

    const response = await request(app)
      .patch(`/products/1`)
      .auth(authToken, { type: "bearer" })
      .send({
        name: "",
        description: "",
        price: -1,
        stock: -1,
        featured: 12,
        pic: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toBe("application/json");

    expect(obtainedProduct).toBeNull();
    expect(errors).not.toBeNull();

    expect(errors).toHaveLength(6);
    expect(errors).toContain("name cannot be empty");
    expect(errors).toContain("description cannot be empty");
    expect(errors).toContain("pic cannot be empty");
    expect(errors).toContain("featured must be true or false");
    expect(errors).toContain("price must be a positive number");
    expect(errors).toContain("stock must be a positive number");

    const productAfterTest = await Product.findByPk(1);

    expect(productBeforeTest).toEqual(productAfterTest);
  });

  it("Should not update and return errors", async () => {
    const testObj = { stock: "error", featured: "error", price: "error" };

    const productFromDB = await Product.create(product5);

    const response = await request(app)
      .patch(`/products/${productFromDB.id}`)
      .auth(authToken, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);
    expect(errors).toContain("stock must be a positive number");
    expect(errors).toContain("featured must be true or false");
    expect(errors).toContain("price must be a positive number");
  });

  it("Should update some atributes of a Product", async () => {
    const testObj = { name: "newName", stock: 0, featured: false };

    const productFromDB = await Product.create(product4);

    const response = await request(app)
      .patch(`/products/${productFromDB.id}`)
      .auth(authToken, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedProduct.id).toEqual(productFromDB.id);

    expect(obtainedProduct.name).toBe(testObj.name);
    expect(obtainedProduct.stock).toBe(testObj.stock);
    expect(obtainedProduct.featured).toBe(testObj.featured);

    expect(obtainedProduct.description).toBe(product4.description);
    expect(obtainedProduct.price).toBe(product4.price);
    expect(obtainedProduct.pic).toBe(product4.pic);
    expect(obtainedProduct.categoryId).toBe(product4.categoryId);
  });

  it("Should update all of atributes from a Product", async () => {
    const response = await request(app)
      .patch(`/products/${1}`)
      .auth(authToken, { type: "bearer" })
      .send(product2);

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toMatchObject(product2);
  });
  
  it("Should not update and return an error", async () => {
    const response = await request(app)
      .patch(`/products/${99}`)
      .auth(authToken, { type: "bearer" })
      .send(product2);

    const {
      statusCode,
      type: responseType,
      body: { product: obtainedProduct, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedProduct).toBeNull();

    expect(errors).not.toBe(undefined);
    expect(errors.length).toBe(1);
    expect(errors).toContain("Product is not available");
  });
});

describe("#DELETE /products/:id", () => {
  it("should return the deleted product", async () => {
    const response = await request(app)
      .delete(`/products/${1}`)
      .auth(authToken, { type: "bearer" })
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.type).toMatch(/json/);

    expect(response.body.product.id).toEqual(1);
    const productFromDB = await Product.findByPk(1);
    expect(productFromDB).toBeNull();
  });

  it("should return an error", async () => {
    await Product.sync({ force: true });
    const response = await request(app)
      .delete(`/products/${1}`)
      .auth(authToken, { type: "bearer" })
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body.product).toBeNull();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
