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
    const { surname, name, email, password } = req.body;
    await User.create({ surname, name, email, password });
    return res.send("New user has been added successfully.");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { surname, name, email, password } = req.body;

    const user = await User.findByPk(id);

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (password) user.password = password;

    await user.save();

    return res.send("User modified successfully.");
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      user.destroy();
      return res.send("The user has been deleted successfully.");
    } catch (err) {
      return res.send(err.message || "The user doesn't exist.");
    }
  },
};

module.exports = userController;
