const { Category } = require("../models");

module.exports = async function categorySeeder() {
  const categoriesList = [{ name: "salado" }, { name: "dulce" }];

  await Category.bulkCreate(categoriesList);
  console.log("Category seeder has been ran.");
};



