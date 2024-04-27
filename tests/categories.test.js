const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { Category, sequelize, Admin, User } = require("../models");
const {
  category1,
  category2,
  category3,
  category4,
} = require("./utils/data/category.data");
const { findByPk } = require("../models/Admin");
let authAdmin;
let authUser;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Admin.create({
    surname: "admin",
    name: "admin",
    email: "admin@project.com",
    password: "admin",
  });
  await User.create({
    name: "user",
    surname: "user",
    email: "user@project.com",
    address: "street 1234",
    phone: "123456789",
    password: "user",
  });
  const responseForUser = await request(app).post("/tokens").send({
    email: "user@project.com",
    password: "user",
  });
  authUser = responseForUser.body.token;
  const responseForAdmin = await request(app).post("/tokens").send({
    email: "admin@project.com",
    password: "admin",
  });
  authAdmin = responseForAdmin.body.token;
});

describe("#GET /categories/", () => {
  it("should return an empty array", async () => {
    const response = await request(app).get("/categories/").send();

    const {
      statusCode,
      type: responseType,
      body: { categories: obtainedCategories, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategories).toEqual([]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with one category", async () => {
    await Category.create(category1);

    const response = await request(app).get("/categories/").send();

    const {
      statusCode,
      type: responseType,
      body: { categories: obtainedCategories, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedCategories).toMatchObject([category1]);

    expect(errors).toBeUndefined();
  });

  it("should return a list with two categories", async () => {
    await Category.create(category2);

    const response = await request(app).get("/categories/").send();

    const {
      statusCode,
      type: responseType,
      body: { categories: obtainedCategories, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategories).toMatchObject([category1, category2]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with three categories", async () => {
    await Category.create(category3);

    const response = await request(app).get("/categories/").send();

    const {
      statusCode,
      type: responseType,
      body: { categories: obtainedCategories, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategories).toMatchObject([category1, category2, category3]);
    expect(errors).toBeUndefined();
  });
});

describe("#GET /categories/:id", () => {
  it("should return a Category (id=1)", async () => {
    const response = await request(app)
      .get(`/categories/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toMatchObject(category1);
    expect(errors).toBeUndefined();
  });

  it("should return a Category (id=2)", async () => {
    const response = await request(app)
      .get(`/categories/${2}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toMatchObject(category2);
    expect(errors).toBeUndefined();
  });

  it("should return a Category (id=3)", async () => {
    const response = await request(app)
      .get(`/categories/${3}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toMatchObject(category3);
    expect(errors).toBeUndefined();
  });

  it("should return null and error message (There is no category with the given id)", async () => {
    const response = await request(app)
      .get(`/categories/${30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Category not available");
  });

  it("should return null and error message (id doesn't valid)", async () => {
    const response = await request(app)
      .get(`/categories/${-30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Category not available");
  });
});

describe("#POST /categories/", () => {
  it("should create a new category without an error", async () => {
    const response = await request(app)
      .post("/categories/")
      .auth(authAdmin, { type: "bearer" })
      .send(category1);

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);
    const categoryFromDB = await Category.findByPk(obtainedCategory.id);
    expect(categoryFromDB).toMatchObject(category1);
    expect(obtainedCategory).toMatchObject(category1);
    expect(errors).toBeUndefined();
  });

  it("should not create a new category and return error (empty name)", async () => {
    const response = await request(app)
      .post("/categories/")
      .auth(authAdmin, { type: "bearer" })
      .send({ name: "" });

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();
    expect(errors).toContain("name cannot be empty");
  });

  it("should not create a new category and return error (null name)", async () => {
    const response = await request(app)
      .post("/categories/")
      .auth(authAdmin, { type: "bearer" })
      .send({ name: "" });

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("name cannot be empty");
  });

  it("should not create a new category and return an error (not authorized)", async () => {
    const response = await request(app)
      .post("/categories/")
      .auth(authUser, { type: "bearer" })
      .send(category4);

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized");
  });
});

describe("#PATCH /categories/:id", () => {
  it("Should not update none of category's atributes", async () => {
    const categoryBeforeTest = await Category.findByPk(1);

    const response = await request(app)
      .patch(`/categories/1`)
      .auth(authAdmin, { type: "bearer" })
      .send({
        name: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();
    expect(errors).not.toBeNull();

    expect(errors).toHaveLength(1);
    expect(errors).toContain("name cannot be empty");

    const categoryAfterTest = await Category.findByPk(1);

    expect(categoryBeforeTest).toEqual(categoryAfterTest);
  });

  it("Should not update and return error", async () => {
    const categoryFromDB = await Category.create(category4);

    const response = await request(app)
      .patch(`/categories/${categoryFromDB.id}`)
      .auth(authAdmin, { type: "bearer" })
      .send({});

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedCategory).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("name is required");
  });

  it("Should update Category", async () => {
    const categoryFromDB = await Category.create(category4);

    const response = await request(app)
      .patch(`/categories/${categoryFromDB.id}`)
      .auth(authAdmin, { type: "bearer" })
      .send(category2);

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    const categoryAfterTest = await Category.findByPk(categoryFromDB.id);

    expect(obtainedCategory).toMatchObject(category2);
    expect(categoryAfterTest).toMatchObject(category2);

    expect(errors).toBeUndefined();
  });

  it("Should not update and return an error", async () => {
    const response = await request(app)
      .patch(`/categories/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send(category2);

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedCategory).toBeNull();

    expect(errors).not.toBe(undefined);
    expect(errors.length).toBe(1);
    expect(errors).toContain("Category is not available");
  });

  it("Should not update and return an error (not authorized)", async () => {
    const response = await request(app)
      .patch(`/categories/${1}`)
      .auth(authUser, { type: "bearer" })
      .send(category4);

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized");
  });
});

describe("#DELETE /categories/:id", () => {
  it("should return the deleted category", async () => {
    const response = await request(app)
      .delete(`/categories/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedCategory.id).toEqual(1);
    const categoryFromDB = await Category.findByPk(1);
    expect(categoryFromDB).toBeNull();

    expect(errors).toBeUndefined();
  });

  it("should return an error", async () => {
    await sequelize.sync({ force: true });
    const response = await request(app)
      .delete(`/categories/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { category: obtainedCategory, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedCategory).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Category not available");
  });

  it("should return an error (not authorized)", async () => {
    const response = await request(app)
      .delete(`/categories/${1}`)
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Access denied. Only admins authorized");
  });
});
