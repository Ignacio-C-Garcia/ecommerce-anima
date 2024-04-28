const request = require("supertest");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = require("../index");
const { sequelize, Admin, User } = require("../models");
const createAdmins = require("./utils/data/admin.data.js");
const createUsers = require("./utils/data/user.data.js");
let admin1, admin2, admin3;
let user1;
const { jwtDecode } = require("jwt-decode");

beforeAll(async () => {
  [admin1, admin2, admin3] = await createAdmins();
  [user1] = await createUsers();
  await sequelize.sync({ force: true });
  await Admin.bulkCreate([admin1, admin2, admin3]);
  await User.create(user1);
});

describe("#POST /tokens/", () => {
  it("should create a token (Admin2)->(token role Admin)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .send({ email: admin2.email, password: "adminPassword" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(token).not.toBeUndefined();
    expect(jwtDecode(token)).toMatchObject({ sub: 2, role: "Admin" });
    expect(errors).toBeUndefined();
  });

  it("should create a token (User1)->(token role User)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .send({ email: user1.email, password: "userPassword" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(token).not.toBeUndefined();
    expect(jwtDecode(token)).toMatchObject({ sub: 1, role: "User" });
    expect(errors).toBeUndefined();
  });

  it("should return an error (empty email)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .send({ email: "", password: "1234" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(token).toBeNull();
    expect(errors).toContain("Invalid credentials! Check it and try again");
  });

  it("should return an error (empty password)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
      .send({ email: admin2.email, password: "" });

    const {
      statusCode,
      type: responseType,
      body: { token, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(token).toBeNull();
    expect(errors).toContain("Invalid credentials! Check it and try again");
  });

  it("should return an error (null email)->(errors)", async () => {
    const response = await request(app)
      .post("/tokens/")
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
    expect(token).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Invalid credentials! Check it and try again");
  });
});

describe("GET (endpoint not implemented)", () => {
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

describe("#PUT (endpoint not implemented)", () => {
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

describe("#PATCH (endpoint not implemented)", () => {
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

describe("#DELETE (endpoint not implemented)", () => {
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
