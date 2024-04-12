require("dotenv").config();
const adminSeeder = require("./adminSeeder");
const productSeeder = require("./productSeeder");
const categorySeeder = require("./categorySeeder");
const userSeeder = require("./userSeeder");

categorySeeder();
adminSeeder();
productSeeder();
userSeeder();

console.log("Seeders has been ran");
