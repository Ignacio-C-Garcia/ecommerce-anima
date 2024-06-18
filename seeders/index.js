require("dotenv").config();
const adminSeeder = require("./adminSeeder");
const productSeeder = require("./productSeeder");
const categorySeeder = require("./categorySeeder");
const orderSeeder = require("./orderSeeder");
const userSeeder = require("./userSeeder");
const kittenSeeder = require("./kittenSeeder");
async function run() {
  await adminSeeder();
  await userSeeder();
  await categorySeeder();
  await productSeeder();
  await orderSeeder();
  await kittenSeeder();
  console.log("Seeders has been ran");
}
run();
