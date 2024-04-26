const { Order } = require("../models");

module.exports = async function orderSeeders() {
  const status = [
    { status: "pending", products: "{example: 10}", address: "...", userId: 1 },
    { status: "pending", products: "{example: 10}", address: "...", userId: 2 },
    { status: "pending", products: "{example: 10}", address: "...", userId: 2 },
    { status: "pending", products: "{example: 10}", address: "...", userId: 3 },
  ];

  await Order.bulkCreate(status);
  console.log("Order seeder has been ran.");
};
