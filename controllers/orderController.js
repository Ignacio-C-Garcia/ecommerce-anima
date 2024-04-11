const { Order } = require("../models");

const orderController = {
  index: async (req, res) => {
    const { productList, status } = req.body;
    await Order.create({ productList, status });
    return res.send("Register added successfully!");
  },

  show: async (req, res) => {
    const orders = await Order.findAll();
    return res.json(orders);
  },

  store: async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    return res.json(order);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { productList, status } = req.body;

    const admin = await Admin.findByPk(id);

    if (status) order.status = status;
    if (productList) admin.productList = productList;

    await order.save();

    return res.send("Admin modified successfully!");
  },
  destroy: async (req, res) => {},
  // TODO: Write the destroy method
};
module.exports = orderController;
