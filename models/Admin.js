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
              msg: "name cannot be null",
            },
            notEmpty: { msg: "name cannot be empty" },
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
              msg: "name cannot be null",
            },
            notEmpty: { msg: "name cannot be empty" },
          },
        },
        password: {
          type: DataTypes.STRING(),
          validate: {
            isStrongPassword(value) {
              // Comprueba si la contraseña tiene al menos 8 caracteres,
              // al menos un símbolo, una letra mayúscula y un número.
              if (!/(?=.*[!@#$%^&*()?¿¡!])/.test(value)) {
                throw new Error(
                  "La contraseña debe contener al menos un símbolo (!@#$%^&*()?¿¡!)"
                );
              }
              if (!/(?=.*[A-Z])/.test(value)) {
                throw new Error(
                  "La contraseña debe contener al menos una letra mayúscula"
                );
              }
              if (!/(?=.*[0-9])/.test(value)) {
                throw new Error(
                  "La contraseña debe contener al menos un número"
                );
              }
              if (value.length < 8) {
                throw new Error(
                  "La contraseña debe tener al menos 8 caracteres"
                );
              }
            },
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
