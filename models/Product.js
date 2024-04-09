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
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        photo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        stock: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        price: {
          type: DataTypes.NUMBER,
          allowNull: false,
        },
        featured: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "product",
      }
    );
    return User;
  }
}

module.exports = Product;
