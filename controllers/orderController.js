const { Order, Product } = require("../models");

const orderController = {
  index: async (req, res) => {
    try {
      const orders = await Order.findAll();
      if (!orders || orders.length === 0)
        res.status(404).json({ errors: "No orders found" });
      else res.status(200).json(orders);
    } catch (err) {
      return res.status(400).json({ errors: "Bad request!" });
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);
      !order
        ? res.status(404).json({ errors: "No orders found" })
        : res.status(200).json({ order });
    } catch (err) {
      return res.status(400).json({ errors: "Bad request!" });
    }
  },

  store: async (req, res) => {
    try {
      const order = req.body;
      if (!order.address) return res.status(400).json({ errors: "Unauthorized" });
      if (!order.userId) return res.status(400).json({ errors: "Unauthorized" });

      //recorremos los productos que vienen en la order vía req.body y cortamos la funcion si el stock es insuficiente, y agregamos los precios sacado de la DB.r
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
      for (const product of order.products) {
        const productsInDb = await Product.findByPk(product.id);

        productsInDb.stock = productsInDb.stock - product.qty;

        await productsInDb.save();
      }

      await Order.create(order);
      return res.status(201).json({ message: "Register added successfully!" });
    } catch (err) {
      return res.status(400).json({ errors: "Bad request!" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { products, status, addres } = req.body;

      const order = await order.findByPk(id);

      if (status) order.status = status;
      if (products) order.products = products;
      if (addres) order.addres = addres;

      await order.save();

      return res
        .status(201)
        .json({ order, message: "order modified successfully!" });
    } catch (err) {
      return res.status(404).json({order: null, errors: ["Order not found"] });
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
};
module.exports = orderController;
