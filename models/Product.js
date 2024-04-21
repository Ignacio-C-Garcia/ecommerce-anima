const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "name field can't be empty" },
        //    isAlpha: { msg: "name must be valid" },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "description field can't be empty" },
          },
        },
        pic: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "pic field can't be empty" },
          },
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 0,
          },
        },
        featured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          values: [true, false],
        },
      },
      {
        sequelize,
        modelName: "product",
      }
    );
    return Product;
  }
}

module.exports = Product;
