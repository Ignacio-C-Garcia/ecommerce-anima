const { Model, DataTypes } = require("sequelize");

class Kitten extends Model {
  static initModel(sequelize) {
    Kitten.init(
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
        birthdate: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "birthdate cannot be null",
            },
            notEmpty: { msg: "birthdate cannot be empty" },
          },
        },
        personality: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notNull: {
              msg: "personality cannot be null",
            },
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
        age: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: "age cannot be null",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "kitten",
      }
    );
    return Kitten;
  }
}

module.exports = Kitten;
