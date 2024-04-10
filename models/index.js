const { Sequelize } = require("sequelize");

const Admin = require("./Admin");
const Product = require("./Product");
const Order = require("./Order");
const User = require("./User");

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
    logging: false,
  }
);

Admin.initModel(sequelize);
Product.initModel(sequelize);
Order.initModel(sequelize);
User.initModel(sequelize);
module.exports = {
  sequelize,
  Admin,
  Product,
  Order,
  User,
};
