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
            notNull: {
              msg: "name cannot be null",
            },
            notEmpty: { msg: "name cannot be empty" },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notNull: {
              msg: "description cannot be null",
            },
            notEmpty: { msg: "description cannot be empty" },
          },
        },
        pic: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "pic cannot be null",
            },
            notEmpty: { msg: "pic cannot be empty" },
          },
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: "stock cannot be null",
            },
            isNumeric: { msg: "stock must be a positive number" },
            min: {
              args: [0],
              msg: "stock must be a positive number",
            },
          },
        },
        price: {
          type: DataTypes.JSON,
          allowNull: false,
          validate: {
            notNull: {
              msg: "price cannot be null",
            },
          },
        },
        calories: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: "calories cannot be null",
            },
            isNumeric: { msg: "calories must be a positive number" },
            min: {
              args: [0],
              msg: "calories must be a positive number",
            },
          },
        },
        featured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            notNull: {
              msg: "featured cannot be null",
            },
            isIn: {
              args: [[true, false, 1, 0]],
              msg: "featured must be true or false",
            },
          },
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
