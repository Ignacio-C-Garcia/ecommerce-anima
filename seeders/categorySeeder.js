const { Category } = require("../models");

module.exports = async function categorySeeder() {
  const categoriesList = [{ name: "salado" }, { name: "dulce" }];

  await Category.bulkCreate(categoriesList);
};



