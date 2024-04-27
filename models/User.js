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
          validate: {
            notNull: {
              msg: "name cannot be null",
            },
            notEmpty: { msg: "name cannot be empty" },
          },
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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "email cannot be null",
            },
            isEmail: { msg: "email must be valid" },
          },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "address cannot be null",
            },
            notEmpty: { msg: "address cannot be empty" },
          },
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "phone cannot be null",
            },
            notEmpty: { msg: "phone cannot be empty" },
          },
        },
        password: {
          type: DataTypes.STRING,
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
        modelName: "user",
      }
    );
    return User;
  }
}
module.exports = User;
