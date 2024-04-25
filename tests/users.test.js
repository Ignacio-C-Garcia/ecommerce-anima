const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize, User, Admin } = require("../models");
const users = require("./utils/data/user.data");
let authAdmin;
let authUser, authUser2, authUser3;

const root = {
  surname: "root",
  name: "root",
  email: "root@project.com",
  password: "root",
};
const user1 = {
  name: "user",
  surname: "user",
  email: "user@project.com",
  address: "street 1234",
  phone: "123456789",
  password: "user",
};
let [user2, user3, user4, user5] = users;
beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Admin.create(root);

  await User.bulkCreate([user1, user2, user3]);

  const {
    body: { token: userToken },
  } = await request(app).post("/tokens").send({
    email: user1.email,
    password: user1.password,
  });

  authUser = userToken;

  const {
    body: { token: userToken2 },
  } = await request(app).post("/tokens").send({
    email: user2.email,
    password: user2.password,
  });

  authUser2 = userToken2;

  const {
    body: { token: userToken3 },
  } = await request(app).post("/tokens").send({
    email: user3.email,
    password: user3.password,
  });

  authUser3 = userToken3;

  const {
    body: { token: adminToken },
  } = await request(app).post("/tokens").send({
    email: "root@project.com",
    password: "root",
  });

  authAdmin = adminToken;
});

describe("#GET /users/", () => {
  it("should return an error (not authorized)", async () => {
    const response = await request(app)
      .get("/users/")
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedUsers).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });

  it("should return an error (missing token)", async () => {
    const response = await request(app).get("/users/").send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedUsers).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Cannot authenticate API key");
  });

  it("should return an empty array (length = 1)", async () => {
    const response = await request(app)
      .get("/users/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUsers).toHaveLength(1);
    expect(errors).toBeUndefined();
  });

  it("should return a list with user1 and user2", async () => {
    await User.create(user2);

    const response = await request(app)
      .get("/users/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedUsers).toMatchObject([user1, user2]);

    expect(errors).toBeUndefined();
  });

  it("should return a list with user1, user2 and user3", async () => {
    await User.create(user3);

    const response = await request(app)
      .get("/users/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUsers).toMatchObject([user1, user2, user3]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with user1, user2, user3 and user4", async () => {
    await User.create(user4);

    const response = await request(app)
      .get("/users/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { users: obtainedUsers, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUsers).toMatchObject([user1, user2, user3, user4]);
    expect(errors).toBeUndefined();
  });
});

describe("#GET /users/:id", () => {
  it("should return user1 (with user1's token)", async () => {
    const response = await request(app)
      .get(`/users/${1}`)
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toMatchObject(user1);
    expect(errors).toBeUndefined();
  });

  it("should return user1 (with admin's token)", async () => {
    const response = await request(app)
      .get(`/users/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toMatchObject(user1);
    expect(errors).toBeUndefined();
  });

  it("should return an error (user1 requested user2)", async () => {
    const response = await request(app)
      .get(`/users/${2}`)
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toBeNull(user3);
    expect(errors).toContain("Access denied");
  });

  it("should return null and error message (There is no user with the given id)", async () => {
    const response = await request(app)
      .get(`/users/${30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("User not found");
  });

  it("should return null and error message (id doesn't valid)", async () => {
    const response = await request(app)
      .get(`/users/${-30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("User not found");
  });

  it("Should return an error (token does not exist)", async () => {
    const response = await request(app).get(`/users/${99}`).send();

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Cannot authenticate API key");
  });
});

describe("#POST /users/", () => {
  it("should create a new user without an error", async () => {
    const response = await request(app).post("/users/").send(user4);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);

    const adminFromDB = await User.findByPk(obtainedUser.id);
    user4.password = adminFromDB.password;
    expect(adminFromDB).toMatchObject(user2);
    expect(obtainedUser).toMatchObject(user2);
    expect(errors).toBeUndefined();
  });

  it("should return errors (surname,email, address, phone and password are null)", async () => {
    const response = await request(app)
      .post("/users/")
      .send({ name: "error user" });

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(5);

    expect(errors).toContain("surname cannot be null");
    expect(errors).toContain("email cannot be null");
    expect(errors).toContain("address cannot be null");
    expect(errors).toContain("phone cannot be null");
    expect(errors).toContain("password cannot be null");
  });

  it("should return errors (name ,email, address, phone and password are null)", async () => {
    const response = await request(app)
      .post("/users/")
      .send({ surname: "error user" });

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();
    expect(errors).not.toBeUndefined();

    expect(errors).toContain("name cannot be null");
    expect(errors).toContain("email cannot be null");
    expect(errors).toContain("address cannot be null");
    expect(errors).toContain("phone cannot be null");
    expect(errors).toContain("password cannot be null");
  });

  it("should return an error (email must be valid)", async () => {
    const response = await request(app)
      .post("/users/")
      .auth(authAdmin, { type: "bearer" })
      .send({
        name: "should return an error",
        surname: "user error",
        email: "adminEmailWithoutFormat",
        password: "user",
      });

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("email must be valid");
  });

  it("should return an error (name, surname, email, address, phone and password are empty)", async () => {
    const response = await request(app).post("/users/").send({
      name: "",
      surname: "",
      password: "",
      email: "",
      address: "",
      phone: "",
    });

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);

    expect(errors).toContain("");
  });
});

describe("#PATCH /users/:id", () => {
  it("Should not update none of user's atributes (name, surname, email, address, phone and password are empty)", async () => {
    const adminBeforeTest = await User.findByPk(2);

    const response = await request(app)
      .patch(`/users/2`)
      .auth(authAdmin, { type: "bearer" })
      .send({
        name: "",
        surname: "",
        email: "",
        password: "",
        address: "",
        email: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser).toBeNull();
    expect(errors).not.toBeNull();

    expect(errors).toContain("name cannot be empty");
    expect(errors).toContain("surname cannot be empty");
    expect(errors).toContain("email cannot be empty");
    expect(errors).toContain("address cannot be empty");
    expect(errors).toContain("phone cannot be empty");
    expect(errors).toContain("password cannot be empty");
    expect(errors).toHaveLength(6);
    const adminAfterTest = await User.findByPk(2);

    expect(adminBeforeTest).toEqual(adminAfterTest);
  });

  it("Should update some atributes of a User (admin modifies user4)", async () => {
    const testObj = { name: "newName", email: "newEmail@user.com" };

    const adminFromDB = await User.create(user4);

    const response = await request(app)
      .patch(`/users/${adminFromDB.id}`)
      .auth(authAdmin, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser.id).toEqual(adminFromDB.id);

    expect(obtainedUser.name).toBe(testObj.name);
    expect(obtainedUser.email).toBe(testObj.email);

    expect(obtainedUser.surname).toBe(user4.surname);
    expect(obtainedUser.password).toBe(user4.password);
    expect(obtainedUser.address).toBe(user4.address);
    expect(obtainedUser.phone).toBe(user4.phone);
    expect(errors).toBeUndefined();
  });
  it("Should update some atributes of a User (user2 modifies user2)", async () => {
    const testObj = { name: "newName", email: "newEmail@user.com" };

    const adminFromDB = await User.create(user2);

    const response = await request(app)
      .patch(`/users/${adminFromDB.id}`)
      .auth(authUser2, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser.id).toEqual(adminFromDB.id);

    expect(obtainedUser.name).toBe(testObj.name);
    expect(obtainedUser.email).toBe(testObj.email);

    expect(obtainedUser.surname).toBe(user2.surname);
    expect(obtainedUser.password).toBe(user2.password);
    expect(obtainedUser.address).toBe(user2.address);
    expect(obtainedUser.phone).toBe(user2.phone);
    expect(errors).toBeUndefined();
  });
  it("Should return an error (user2 try to modify user4)", async () => {
    const testObj = { name: "newName", email: "newEmail@user.com" };

    const adminFromDB = await User.create(user4);

    const response = await request(app)
      .patch(`/users/${adminFromDB.id}`)
      .auth(authUser2, { type: "bearer" })
      .send(testObj);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedUser.id).toEqual(adminFromDB.id);

    expect(obtainedUser.name).toBe(testObj.name);
    expect(obtainedUser.email).toBe(testObj.email);

    expect(obtainedUser.surname).toBe(user4.surname);
    expect(obtainedUser.password).toBe(user4.password);
    expect(obtainedUser.address).toBe(user4.address);
    expect(obtainedUser.phone).toBe(user4.phone);
    expect(errors).toBeUndefined();
  });

  it("Should update all of atributes from a User (user3 modifies user3)", async () => {
    await sequelize.sync({ force: true });
    await User.create(user3);
    await User.create(user4);
    const response = await request(app)
      .patch(`/users/${1}`)
      .auth(authUser3, { type: "bearer" })
      .send(user4);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toMatchObject(user4);
    expect(errors).toBeUndefined();
  });

  it("Should return an error (id does not exist)", async () => {
    const response = await request(app)
      .patch(`/users/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send(user2);

    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("User not found");
  });

  it("Should return an error (token does not exist)", async () => {
    const response = await request(app).patch(`/users/${99}`).send(user4);

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Cannot authenticate API key");
  });
});

describe("#DELETE /users/:id", () => {
  it("should return the deleted user (admin deletes user4)", async () => {
    await sequelize.sync({ force: true });
    await User.create(user4);
    const response = await request(app)
      .delete(`/users/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;
    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toMatchObject(user4);
    const adminFromDB = await User.findByPk(1);
    expect(adminFromDB).toBeNull();
    expect(errors).toBeUndefined();
  });

  it("should return the deleted user (user2 deletes user2)", async () => {
    await sequelize.sync({ force: true });
    await User.create(user2);
    const response = await request(app)
      .delete(`/users/${1}`)
      .auth(authUser2, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;
    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toMatchObject(user2);
    const adminFromDB = await User.findByPk(1);
    expect(adminFromDB).toBeNull();
    expect(errors).toBeUndefined();
  });

  it("should return the deleted user (user2 tries to delete user3)", async () => {
    await sequelize.sync({ force: true });
    await User.create(user);
    await User.create(user2);
    await User.create(user3);
    const response = await request(app)
      .delete(`/users/${3}`)
      .auth(authUser2, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;
    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();
    const adminFromDB = await User.findByPk(3);
    expect(adminFromDB).not.toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Not authorized");
  });

  it("should return an error (id does not exist in DB)", async () => {
    await User.sync({ force: true });
    const response = await request(app)
      .delete(`/users/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { user: obtainedUser, errors },
    } = response;
    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedUser).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("User not found");
  });
});
