const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const {
  sequelize,
  Order,
  User,
  Product,
  Admin,
  Category,
} = require("../models");
const {
  order1FromUser1,
  order2FromUser1,
  order1FromUser2,
  order2FromUser2,
} = require("./utils/data/order.data");
const { product1, product2, product3 } = require("./utils/data/product.data");
const [user1, user2] = require("./utils/data/user.data");
const { category1, category2 } = require("./utils/data/category.data");
let authAdmin;
let authUser, authUser2;

const root = {
  surname: "root",
  name: "root",
  email: "root@project.com",
  password: "root",
};

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Admin.create(root);
  await User.bulkCreate([user1, user2]);
  await Category.bulkCreate([category1, category2]);
  await Product.bulkCreate([product1, product2, product3]);

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
    body: { token: adminToken },
  } = await request(app).post("/tokens").send({
    email: "root@project.com",
    password: "root",
  });

  authAdmin = adminToken;
});

describe("#GET /orders/", () => {
  it("should return an error (missing token)", async () => {
    const response = await request(app).get("/orders/").send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrders).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Cannot authenticate API key");
  });

  it("should return an error (not authorized)", async () => {
    const response = await request(app)
      .get("/orders/")
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrders).toBeUndefined();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Access denied. Only admins authorized.");
  });

  it("should return an empty array (length = 0)", async () => {
    const response = await request(app)
      .get("/orders/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrders).toHaveLength(0);
    expect(errors).toBeUndefined();
  });

  it("should return a list with order1FromUser1", async () => {
    await Order.create(order1FromUser1);

    const response = await request(app)
      .get("/orders/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrders).toMatchObject([order1FromUser1]);

    expect(errors).toBeUndefined();
  });

  it("should return a list with order1FromUser1 and order2FromUser1", async () => {
    await Order.create(order2FromUser1);

    const response = await request(app)
      .get("/orders/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrders).toMatchObject([order1FromUser1, order2FromUser1]);
    expect(errors).toBeUndefined();
  });

  it("should return a list with order1FromUser1, order2FromUser1, order1FromUser2 ", async () => {
    await Order.create(order1FromUser2);

    const response = await request(app)
      .get("/orders/")
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { orders: obtainedOrders, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrders).toMatchObject([
      order1FromUser1,
      order2FromUser1,
      order1FromUser2,
    ]);
    expect(obtainedOrders).toHaveLength(3);
    expect(errors).toBeUndefined();
  });
});

describe("#GET /orders/:id", () => {
  it("should return order1 ", async () => {
    const response = await request(app)
      .get(`/orders/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrder).toMatchObject(order1FromUser1);
    expect(errors).toBeUndefined();
  });

  it("should return an error (user requested an order)", async () => {
    const response = await request(app)
      .get(`/orders/${2}`)
      .auth(authUser, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(403);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrder).toBeNull(order3);
    expect(errors).toContain("Access denied. Only admins authorized.");
  });

  it("should return null and error message (There is no order with the given id)", async () => {
    const response = await request(app)
      .get(`/orders/${30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrder).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("Order not found");
  });

  it("should return null and error message (id doesn't valid)", async () => {
    const response = await request(app)
      .get(`/orders/${-30}`)
      .auth(authAdmin, { type: "bearer" })
      .send();

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrder).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Order not found");
  });

  it("Should return an error (token does not exist)", async () => {
    const response = await request(app).get(`/orders/${99}`).send();

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

describe("#POST /orders/", () => {
  it("should create a new order without an error", async () => {
    const response = await request(app)
      .post("/orders/")
      .auth(authAdmin, { type: "bearer" })
      .send(order2FromUser2);

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(201);
    expect(responseType).toMatch(/json/);

    const adminFromDB = await Order.findByPk(obtainedOrder.id);
    order4.password = adminFromDB.password;
    expect(adminFromDB).toMatchObject(order2FromUser2);
    expect(obtainedOrder).toMatchObject(order2FromUser2);
    expect(errors).toBeUndefined();
  });

  it("should return errors (address and userId are null)", async () => {
    const response = await request(app)
      .post("/orders/")
      .send({ products: "{error : true}" });

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrder).toBeNull();
    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(2);

    expect(errors).toContain("address cannot be null");
    expect(errors).toContain("userId cannot be null");
  });

  it("should return errors (products and userId null)", async () => {
    const response = await request(app)
      .post("/orders/")
      .send({ address: "error 1234c" });

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrder).toBeNull();
    expect(errors).not.toBeUndefined();

    expect(errors).toContain("products cannot be null");
    expect(errors).toContain("userId cannot be null");
  });

  it("should return an error (products, address and userId are empty)", async () => {
    const response = await request(app).post("/orders/").send({
      products: "",
      address: "",
      userId: "",
    });

    const {
      statusCode,
      type: responseType,
      body: { errors },
    } = response;

    expect(statusCode).toBe(401);
    expect(responseType).toMatch(/json/);
    expect(errors).not.toBeUndefined();
    expect(errors).toContain("products...");
  });
});

describe("#PATCH /orders/:id", () => {
  it("Should not update none of order's atributes (name, surname, email, address, phone and password are empty)", async () => {
    const adminBeforeTest = await Order.findByPk(2);

    const response = await request(app)
      .patch(`/orders/2`)
      .auth(authAdmin, { type: "bearer" })
      .send({
        products: "",
        address: "",
        userId: "",
      });

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(400);
    expect(responseType).toMatch(/json/);

    expect(obtainedOrder).toBeNull();
    expect(errors).not.toBeNull();

    expect(errors).toContain("products cannot be empty");
    expect(errors).toContain("address cannot be empty");
    expect(errors).toContain("userId cannot be empty");
    expect(errors).toHaveLength(3);
    const adminAfterTest = await Order.findByPk(2);

    expect(adminBeforeTest).toEqual(adminAfterTest);
  });

  it("Should return an error (id does not exist)", async () => {
    const response = await request(app)
      .patch(`/orders/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send(order1FromUser1);

    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;

    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrder).toBeNull();

    expect(errors).not.toBeUndefined();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("Order not found");
  });

  it("Should return an error (token does not exist)", async () => {
    const response = await request(app)
      .patch(`/orders/${99}`)
      .send(order1FromUser2);

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

describe("#DELETE /orders/:id", () => {
  it("should return the deleted order (admin deletes order1)", async () => {
    await Order.sync({ force: true });
    await Order.create(order1FromUser1);
    const response = await request(app)
      .delete(`/orders/${1}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;
    expect(statusCode).toBe(200);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrder).toMatchObject(order1FromUser1);
    const adminFromDB = await Order.findByPk(1);
    expect(adminFromDB).toBeNull();
    expect(errors).toBeUndefined();
  });

  it("should return an error (id does not exist in DB)", async () => {
    await Order.destroy({
      where: {},
    });
    const response = await request(app)
      .delete(`/orders/${99}`)
      .auth(authAdmin, { type: "bearer" })
      .send();
    const {
      statusCode,
      type: responseType,
      body: { order: obtainedOrder, errors },
    } = response;
    expect(statusCode).toBe(404);
    expect(responseType).toMatch(/json/);
    expect(obtainedOrder).toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors).toContain("The order doesn't exist");
  });
});
