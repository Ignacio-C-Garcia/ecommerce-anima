const { Order } = require("../models");

module.exports = async function orderSeeders() {
  const status = [{ status: "pending", products: "{example: 10}", address: "..." }];

  await Order.bulkCreate(status);
  console.log("Order seeder has been ran.");
};
