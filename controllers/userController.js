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
    const user = req.body;
    if (
      !user.name ||
      !user.surname ||
      !user.email ||
      !user.address ||
      !user.phone ||
      !user.password
    ) {
      return res.status(400).send("All fields are required for user creation.");
    }
    await User.create(user);
    return res.send("New user has been added successfully.");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const userInfo = req.body;

    const user = await User.findByPk(id);

    if (!user) res.status(404).send("Admin not found.");
    if (userInfo.name) user.name = userInfo.name;
    if (userInfo.surname) user.surname = userInfo.surname;
    if (userInfo.email) user.email = userInfo.email;
    if (userInfo.address) user.address = userInfo.address;
    if (userInfo.phone) user.phone = userInfo.phone;
    if (userInfo.password) user.password = userInfo.password;

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
