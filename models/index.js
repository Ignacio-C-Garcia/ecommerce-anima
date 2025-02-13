const { Sequelize } = require("sequelize");
const Admin = require("./Admin");
const Product = require("./Product");
const Order = require("./Order");
const User = require("./User");
const Category = require("./Category");
const Kitten = require("./Kitten");

const sequelizeOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION,
  logging: false,
};

if (process.env.DB_CONNECTION === "postgres") {
  sequelizeOptions.dialectModule = require("pg");
}

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_CONNECTION,
    define: {
      timestamps: false,
    },
    logging: false,
    sequelizeOptions,
  }
);

Admin.initModel(sequelize);
Product.initModel(sequelize);
Order.initModel(sequelize);
User.initModel(sequelize);
Category.initModel(sequelize);
Kitten.initModel(sequelize);

Category.hasMany(Product, {
  foreignKey: {
    allowNull: false,
  },
  onDelete: "RESTRICT",
});
Product.belongsTo(Category);

User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
  sequelize,
  Admin,
  Product,
  Order,
  User,
  Category,
  Kitten,
};
