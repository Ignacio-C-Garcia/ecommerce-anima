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
              msg: "surname cannot be null",
            },
            notEmpty: { msg: "surname cannot be empty" },
          },
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "email cannot be null",
            },
            notEmpty: { msg: "email cannot be empty" },
            isEmail: { msg: "email must be valid" },
          },
        },
        password: {
          type: DataTypes.STRING(),
          allowNull: false,
          validate: {
            notNull: {
              msg: "password cannot be null",
            },
            notEmpty: { msg: "password cannot be empty" },
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
