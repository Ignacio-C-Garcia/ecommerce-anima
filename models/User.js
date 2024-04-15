const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    User.init(
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
        surname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "user",
      }
    );
    return User;
  }
}
module.exports = User;
