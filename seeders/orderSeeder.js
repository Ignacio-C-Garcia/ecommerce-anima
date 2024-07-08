const { faker } = require("@faker-js/faker");

const { Order, Product } = require("../models");

module.exports = async function orderSeeders() {
  const orders = [];

  const allProducts = await Product.findAll();

  for (let i = 0; i < 29; i++) {
    const address = faker.location.street();
    const status = "pending";
    const products = [];

    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      const selectedProduct = allProducts[randomIndex];
      products.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        qty: Math.floor(Math.random() * 10) + 1,
        price: selectedProduct.price,
      });
    }

    orders.push({
      address,
      status,
      products,
      userId: Math.floor(Math.random() * 6) + 1,
    });
  }

  await Order.bulkCreate(orders);
  console.log("Seeders has been run");
};
