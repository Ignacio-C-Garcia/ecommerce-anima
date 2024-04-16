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
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
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
