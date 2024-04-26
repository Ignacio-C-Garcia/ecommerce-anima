const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        products: {
          type: DataTypes.JSON,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Products list cannot be empty",
            },
        },
      },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Address cannot be empty",
            },
            len: {
              args: [5, 150], 
              msg: "Address must be between 5 and 150 characters",
            },
          },
        },
        status: {
          type: DataTypes.STRING,
          values: ["pending", "rejected", "processing", "shipped", "delivered"],
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "order",
      }
    );
    return Order;
  }
}

module.exports = Order;
