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
      products.push({ id: selectedProduct.id, qty: 10, price: 100 });
    }

    orders.push({
      address,
      status,
      products,
      userId: 1,
    });
  }

  await Order.bulkCreate(orders);
  console.log("Seeders has been run");
};
