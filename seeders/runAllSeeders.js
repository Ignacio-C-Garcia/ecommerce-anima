require("dotenv").config();
const adminSeeder = require("./adminSeeder");
const productSeeder = require("./productSeeder");
const categorySeeder = require("./categorySeeder");
const orderSeeders = require("./orderSeeder")

orderSeeders();
categorySeeder();
adminSeeder();
productSeeder();
console.log("Seeders has been ran");
