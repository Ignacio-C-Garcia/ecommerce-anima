const { Order } = require("../models");

module.exports = async function orderSeeders() {
  const status = [{ status: "pending", productList: "{example: 10}" }];

  await Order.bulkCreate(status);
  console.log("Order seeder has been ran.");
};
