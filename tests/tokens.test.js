const request = require("supertest");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = require("../index");
const { sequelize, Admin, User } = require("../models");
const [admin2, admin3, admin4] = require("./utils/data/admin.data.js");
const user1 = {
  name: "user",
  surname: "user",
  email: "user@project.com",
  address: "street 1234",
  phone: "123456789",
  password: "user",
};
const { jwtDecode } = require("jwt-decode");
let authAdmin;
let authUser;
beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Admin.create({
    surname: "root",
    name: "root",
    email: "root@project.com",
    password: "root",
  });
  await Admin.bulkCreate([admin2, admin3, admin4]);
  await User.create(user1);
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

describe("#POST /tokens/", () => {
  it("should create a token (Admin)->(token role Admin)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .auth(authAdmin, { type: "bearer" })
      .send(admin2);

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);
    expect(token).not.toBeUndefined();
    expect(jwtDecode(token)).toMatchObject({ sub: 2, role: "Admin" });
    expect(errors).toBeUndefined();
  });

  it("should create a token (User)->(token role User)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .auth(authAdmin, { type: "bearer" })
      .send(user1);

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);
    expect(token).not.toBeUndefined();
    expect(jwtDecode(token)).toMatchObject({ sub: 1, role: "User" });
    expect(errors).toBeUndefined();
  });

  it("should return an error (empty email)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .auth(authAdmin, { type: "bearer" })
      .send({ email: "", password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(token).toBeUndefined();
    expect(errors).toContain("Invalid credentials! Check it and try again");
  });

  it("should return an error (empty password)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .auth(authAdmin, { type: "bearer" })
      .send({ email: admin2.email, password: "" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(token).toBeUndefined();
    expect(errors).toContain("Cannot authenticate. Try again");
  });

  it("should return an error (null email)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .auth(authAdmin, { type: "bearer" })
      .send({ password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(token).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Invalid credentials! Check it and try again");
  });

  it("should return an error (null password)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .send({ email: "admin@project.com" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(token).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Invalid credentials! Check it and try again.");
  });
});

describe("GET (endpoint not implemented)",  () => {
  it("should return an error (Endpoint not found)", async () => {
    const response = await request(app)
      .get("/tokens/")
      .send({ email: "admin@project.com", password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Endpoint not found");
  });
});

describe("#PUT (endpoint not implemented)",  () => {
  it("should return an error (Endpoint not found)", async () => {
    const response = await request(app)
      .put("/tokens/")
      .send({ email: "admin@project.com", password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Endpoint not found");
  });
});

describe("#PATCH (endpoint not implemented)",  () => {
  it("should return an error (Endpoint not found)", async () => {
    const response = await request(app)
      .patch("/tokens/")
      .send({ email: "admin@project.com", password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Endpoint not found");
  });
});

describe("#DELETE (endpoint not implemented)",  () => {
  it("should return an error (Endpoint not found)", async () => {
    const response = await request(app).delete("/tokens/").send();

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Endpoint not found");
  });
});

