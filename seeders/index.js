require("dotenv").config();
const adminSeeder = require("./adminSeeder");
const productSeeder = require("./productSeeder");
const categorySeeder = require("./categorySeeder");
const orderSeeder = require("./orderSeeder");
const userSeeder = require("./userSeeder");

orderSeeder();
categorySeeder();
adminSeeder();
productSeeder();
userSeeder();

console.log("Seeders has been ran");
