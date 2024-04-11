const { Admin } = require("../models");

const adminController = {
  index: async (req, res) => {
    const admins = await Admin.findAll();
    return res.json(admins);
  },
  show: async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    return res.json(admin);
  },
  store: async (req, res) => {
    const { surname, name, email, password } = req.body;
    await Admin.create({ surname, name, email, password });
    return res.send("Register added successfully!");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { surname, name, email, password } = req.body;

    const admin = await Admin.findByPk(id);

    if (name) admin.name = name;
    if (surname) admin.surname = surname;
    if (email) admin.email = email;
    if (password) admin.password = password;

    await admin.save();

    return res.send("Admin modified successfully!");
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    await Admin.destroy({
      where: {
        id,
      },
    });
    return res.send("The admin has been deleted successfully!");
  },
};

module.exports = adminController;
