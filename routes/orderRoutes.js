const express = require("express");
const router = express.Router();
const { Order } = require("../models");

router.post("/", async (req, res) => {
  const { productList, status } = req.body;
  await Order.create({ productList, status });
  return res.send("Register added successfully!");
});

router.get("/", async (req, res) => {
  const orders = await Order.findAll();
  return res.json(orders);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByPk(id);
  return res.json(order);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { productList, status } = req.body;

  const admin = await Admin.findByPk(id);

  if (status) order.status = status;
  if (productList) admin.productList = productList;

  await order.save();

  return res.send("Admin modified successfully!");
});

module.exports = router;
