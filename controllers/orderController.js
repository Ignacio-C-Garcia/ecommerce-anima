const { Order, Product } = require("../models");

const orderController = {
  index: async (req, res) => {
    const orders = await Order.findAll();
    return res.json(orders);
  },

  show: async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    return res.json(order);
  },

  store: async (req, res) => {
    try {
    const order = req.body;
    if (!order.addres) return res.json({ message: "Ups! algo salió mal" });
    if (!order.userId) return res.json({ message: "Ups! algo salió mal" });

      //recorremos los productos que vienen en la order vía req.body y cortamos la funcion si el stock es insuficiente, y agregamos los precios sacado de la DB.
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

        productsInDb.stock -= productsInDb.stock - product.qty;

        await productsInDb.save();
      }

      await Order.create(order);
      return res.json({ message: "Register added successfully!" });
    } catch (err) {
      console.log(err);
      return res.json({ message: "Ups! algo salió mal" });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { products, status, addres } = req.body;

    const order = await order.findByPk(id);

    if (status) order.status = status;
    if (products) order.products = products;
    if (addres) order.addres = addres;

    await order.save();

    return res.send("order modified successfully!");
  },

  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      user.destroy();
      return res.send("The user has been deleted successfully.");
    } catch (err) {
      return res.send(err.message || "The user doesn't exist.");
    }
  },
};
module.exports = orderController;
