const { Category } = require("../models");

module.exports = async function categorySeeder() {
  const categoriesList = [
    { name: "Cafés" },
    { name: "Granos" },
    { name: "Bebidas" },
    { name: "Comidas" },
  ];

  await Category.bulkCreate(categoriesList);
  console.log("Category seeder has been ran.");
};
