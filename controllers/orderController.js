const { Order, Product, User } = require("../models");
const errorFormatter = require("../utils/errorFormatter");

const orderController = {
  index: async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
      if (!orders || orders.length === 0)
        res.status(404).json({ orders, errors: ["orders not found"] });
      else res.status(200).json({ orders });
    } catch (err) {
      return res.status(400).json({ orders: null, errors: ["Bad request!"] });
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      !order
        ? res.status(404).json({ order: null, errors: ["Order not found"] })
        : res.status(200).json({ order });
    } catch (err) {
      return res.status(400).json({ errors: "Bad request!" });
    }
  },

  store: async (req, res) => {
    const customerId = req.auth.sub;
    try {
      const order = req.body;
      //    order.products = JSON.parse(order.products);
      if (!order.address) throw new Error("error");

      for (const product of order.products) {
        const productsInDb = await Product.findByPk(product.id);
        if (productsInDb.stock < product.qty) {
          return res.json({
            message: "Unsuficent stock.",
            product: product.id,
            stock: productsInDb.stock,
          });
        }
        product.price = productsInDb.price;
      }
      order.status = "pending";
      order.userId = customerId;
      for (const product of order.products) {
        const productsInDb = await Product.findByPk(product.id);

        productsInDb.stock = productsInDb.stock - product.qty;

        await productsInDb.save();
      }

      const orderdb = await Order.create(order);
      return res
        .status(201)
        .json({ order: orderdb, message: "Register added successfully!" });
    } catch (err) {
      return res.status(400).json({ order: null, errors: err });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { products, status, address } = req.body;

      const order = await Order.findByPk(id);

      if (!order) {
        return res
          .status(404)
          .json({ order: null, errors: ["Order not found"] });
      }

      order.status = status;
      order.products = products;
      order.address = address;

      await order.save();

      return res
        .status(200)
        .json({ order, message: "order modified successfully!" });
    } catch (err) {
      return res.status(400).json({ order: null, errors: errorFormatter(err) });
    }
  },

  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByPk(id);
      order.destroy();
      return res
        .status(200)
        .json({ order, message: "The order has been deleted successfully" });
    } catch (err) {
      return res
        .status(404)
        .json({ order: null, errors: ["The order doesn't exist"] });
    }
  },
  showMyOrders: async (req, res) => {
    const { sub: userId } = req.auth;

    try {
      const orders = await Order.findAll({
        where: {
          userId,
        },
      });
      if (!orders || orders.length === 0)
        res.status(404).json({ orders, errors: ["orders not found"] });
      else res.status(200).json({ orders });
    } catch (err) {
      return res.status(400).json({ orders: null, errors: ["Bad request!"] });
    }
  },
};
module.exports = orderController;
