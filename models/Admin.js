const { Model, DataTypes } = require("sequelize");

class Admin extends Model {
  static initModel(sequelize) {
    Admin.init(
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
        },
        surname: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "The surname cannot be null",
            },
            notEmpty: { msg: "The surname cannot be empty" },
          },
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "The name cannot be null",
            },
            notEmpty: { msg: "name cannot be empty" },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "The email cannot be null",
            },
            notEmpty: { msg: "The email cannot be empty" },
          },
        },
        password: {
          type: DataTypes.STRING(),
          allowNull: false,
          validate: {
            notNull: {
              msg: "The email cannot be null",
            },
            notEmpty: { msg: "The email cannot be empty" },
          },
        },
      },
      {
        sequelize,
        modelName: "admin",
      }
    );
    return Admin;
  }
}
module.exports = Admin;
