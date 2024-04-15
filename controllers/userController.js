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
    const { name, surname, email, address, phone, password } = req.body;
    await User.create({ name, surname, email, address, phone, password });
    return res.send("New user has been added successfully.");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name, surname, email, address, phone, password } = req.body;

    const user = await User.findByPk(id);

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    await user.save();

    return res.send("User has been modified successfully.");
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).send("User not found.");
      }
      user.destroy();
      return res.send("The user has been deleted successfully.");
    } catch (err) {
      return res.send(err);
    }
  },
};

module.exports = userController;
