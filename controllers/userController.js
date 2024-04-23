const { User } = require("../models");
const bcrypt = require("bcryptjs");

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
      return res
        .status(400)
        .json({ errors: ["All fields are required for user creation."] });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    await User.create(user);
    return res.json(user);
  },
  update: async (req, res) => {
    const { id } = req.params;
    const userInfo = req.body;
    const loggedInUserId = req.auth.sub;

    if (id !== loggedInUserId) {
      return res
        .status(403)
        .json({ errors: ["No tienes permiso para modificar este usuario."] });
    }

    const user = await User.findByPk(id);

    if (!user) res.status(404).json({ errors: ["Admin not found."] });
    if (userInfo.name) user.name = userInfo.name;
    if (userInfo.surname) user.surname = userInfo.surname;
    if (userInfo.email) user.email = userInfo.email;
    if (userInfo.address) user.address = userInfo.address;
    if (userInfo.phone) user.phone = userInfo.phone;
    if (userInfo.password) {
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    return res.json(user);
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ errors: ["User not found."] });
      }
      user.destroy();
      return res.json(user);
    } catch (err) {
      return res.json(err);
    }
  },
};

module.exports = userController;
