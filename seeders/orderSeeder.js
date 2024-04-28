const { faker } = require("@faker-js/faker");

const { Order, Product } = require("../models");

module.exports = async function orderSeeders() {
  const orders = [];

  const allProducts = await Product.findAll();

  for (let i = 0; i < 9; i++) {
    const address = faker.location.street();
    const status = "pending";
    const products = [];

    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      const selectedProduct = allProducts[randomIndex];
      products.push(selectedProduct);
    }

    orders.push({
      address,
      status,
      products,
    });
  }

  await Order.bulkCreate(orders);
  console.log("Seeders has been run");
};
