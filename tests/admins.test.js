const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize, User, Admin } = require("../models");
const createAdmins = require("./utils/data/admin.data");
let authAdmin;
let authUser;
let admin2, admin3, admin4, admin5;
const root = {
  surname: "root",
  name: "root",
  email: "root@project.com",
  password: "root",
};
beforeAll(async () => {
  [admin2, admin3, admin4, admin5] = await createAdmins();
  await sequelize.sync({ force: true });

  await Admin.create(root);

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

  const {
    body: { token },
  } = await request(app).post("/tokens").send({
    email: "root@project.com",
    password: "root",
  });

  authAdmin = token;
});

describe("#GET /admins/", () => {
  it("should return an error (not authorized)", async () => {
    const response = await request(app)
      .get("/admins/")
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmins).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });

  it("should return an error (missing token)", async () => {
    const response = await request(app).get("/admins/").send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmins).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Cannot authenticate API key");
  });

  it("should not return an empty array", async () => {
    const response = await request(app)
      .get("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmins).not.toEqual([]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with root and admin2", async () => {
    await Admin.create(admin2);

    const response = await request(app)
      .get("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmins).toMatchObject([root, admin2]);

    expect(errors).toBeUndefined();
  });

  it("should return a list with two admins and root", async () => {
    await Admin.create(admin2);

    const response = await request(app)
      .get("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmins).toMatchObject([root, admin2, admin3]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with three admins and root", async () => {
    await Admin.create(admin3);

    const response = await request(app)
      .get("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admins: obtainedAdmins, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmins).toMatchObject([root, admin2, admin3, admin4]);
    expect(errors).toBeUndefined();
  });
});

describe("#GET /admins/:id", () => {
  it("should return a Admin (id=1)", async () => {
    const response = await request(app)
      .get(`/admins/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toMatchObject(root);
    expect(errors).toBeUndefined();
  });

  it("should return a Admin (id=2)", async () => {
    const response = await request(app)
      .get(`/admins/${2}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toMatchObject(admin2);
    expect(errors).toBeUndefined();
  });

  it("should return a Admin (id=3)", async () => {
    const response = await request(app)
      .get(`/admins/${3}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toMatchObject(admin3);
    expect(errors).toBeUndefined();
  });

  it("should return null and error message (There is no admin with the given id)", async () => {
    const response = await request(app)
      .get(`/admins/${30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Admin not found");
  });

  it("should return null and error message (id doesn't valid)", async () => {
    const response = await request(app)
      .get(`/admins/${-30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Admin not found");
  });
});

describe("#POST /admins/", () => {
  it("should create a new admin without an error", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send(admin2);

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);

    const adminFromDB = await Admin.findByPk(obtainedAdmin.id);

    expect(adminFromDB).toMatchObject(admin2);
    expect(obtainedAdmin).toMatchObject(admin2);
    expect(errors).toBeUndefined();
  });

  it("should not create a new admin and return errors (surname,email and password null)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send({ name: "error admin" });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);

    expect(errors).toContain("surname cannot be null");
    expect(errors).toContain("email cannot be null");
    expect(errors).toContain("password cannot be null");
  });

  it("should not create a new admin and return errors (name,email and password null)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send({ surname: "error admin" });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("email cannot be null");
    expect(errors).toContain("password cannot be null");
  });

  it("should not create a new admin and return errors (surname, name and password null)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send({ email: "admin@error.com" });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("surname cannot be null");
    expect(errors).toContain("password cannot be null");
  });

  it("should not create a new admin and return errors (surname, name, and email null)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send({ password: "error_admin" });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(3);

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("surname cannot be null");
    expect(errors).toContain("email cannot be null");
  });

  it("should not create a new admin and return an error (email must be valid)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authAdmin, { type: "bearer" })
      .send({
        name: "should return an error",
        surname: "admin error",
        email: "adminEmailWithoutFormat",
        password: "admin",
      });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("email must be valid");
  });

  it("should not create a new admin and return an error (not authorized)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authUser, { type: "bearer" })
      .send({
        name: "not authorized",
        surname: "not authorized",
        password: "not_authorized",
        email: "notAuthorized@admin.com",
      });

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });

  it("should not create a new admin and return an error (name, surname, email and password empty)", async () => {
    const response = await request(app)
      .post("/admins/")
      .auth(authUser, { type: "bearer" })
      .send({
        name: "",
        surname: "",
        password: "",
        email: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(4);

    expect(errors).toContain("name cannot be empty");
    expect(errors).toContain("surname cannot be empty");
    expect(errors).toContain("password cannot be empty");
    expect(errors).toContain("email cannot be empty");
  });
});

describe("#PATCH /admins/:id", () => {
  it("Should not update none of admin's atributes (name, surname, email and password empty)", async () => {
    const adminBeforeTest = await Admin.findByPk(1);

    const response = await request(app)
      .patch(`/admins/1`)
      .auth(authAdmin, { type: "bearer" })
      .send({
        name: "",
        surname: "",
        email: "",
        password: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin).toBeNull();
    expect(errors).not.toBeNull();

    expect(errors).toHaveLength(4);
    expect(errors).toContain("name cannot be empty");
    expect(errors).toContain("surname cannot be empty");
    expect(errors).toContain("email cannot be empty");
    expect(errors).toContain("password cannot be empty");

    const adminAfterTest = await Admin.findByPk(1);

    expect(adminBeforeTest).toEqual(adminAfterTest);
  });

  it("Should update some atributes of a Admin", async () => {
    const testObj = { name: "newName", email: "newEmail@admin.com" };

    const adminFromDB = await Admin.create(admin4);

    const response = await request(app)
      .patch(`/admins/${adminFromDB.id}`)
      .auth(authAdmin, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedAdmin.id).toEqual(adminFromDB.id);

    expect(obtainedAdmin.name).toBe(testObj.name);
    expect(obtainedAdmin.email).toBe(testObj.email);

    expect(obtainedAdmin.surname).toBe(admin4.surname);
    expect(obtainedAdmin.password).toBe(admin4.password);
    expect(errors).toBeUndefined();
  });

  it("Should update all of atributes from a Admin", async () => {
    const response = await request(app)
      .patch(`/admins/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send(admin2);

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toMatchObject(admin2);
    expect(errors).toBeUndefined();
  });

  it("Should not update and return an error", async () => {
    const response = await request(app)
      .patch(`/admins/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send(admin2);

    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Admin not found");
  });

  it("Should not update and return an error (not authorized)", async () => {
    const response = await request(app)
      .patch(`/admins/${99}`)
      .auth(authUser, { type: "bearer" })
      .send(admin4);

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });
});

describe("#DELETE /admins/:id", () => {
  it("should return the deleted admin", async () => {
    const response = await request(app)
      .delete(`/admins/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;
    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin.id).toEqual(1);
    const adminFromDB = await Admin.findByPk(1);
    expect(adminFromDB).toBeNull();
    expect(errors).toBeUndefined()
  });

  it("should return an error", async () => {
    await Admin.sync({ force: true });
    const response = await request(app)
      .delete(`/admins/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { admin: obtainedAdmin, errors },
    } = response;
    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedAdmin).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Admin not found")
  });

  it("should return an error (not authorized)", async () => {
    const response = await request(app)
      .delete(`/admins/${2}`)
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });
});
