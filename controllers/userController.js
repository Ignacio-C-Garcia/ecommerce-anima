const { User } = require("../models");

const userController = {
  index: async (req, res) => {
    const users = await User.findAll();
    return res.json(users);
  },
  show: async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    return res.json(user);
  },
  store: async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    await User.create({ firstname, lastname, email, password });
    return res.send("El usuario fue creado con éxito!");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, password } = req.body;

    const user = await User.findByPk(id);

    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    return res.send("Usuario modificado con éxito!");
  },
  destroy: async (req, res) => {},
  // TODO: Escribir el método destroy.
};

module.exports = userController;
