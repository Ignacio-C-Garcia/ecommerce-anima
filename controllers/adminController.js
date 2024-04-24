const { Admin } = require("../models");
const bcrypt = require("bcryptjs");

const adminController = {
  index: async (req, res) => {
    const admins = await Admin.findAll();
    return res.json(admins);
  },

  show: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await Admin.findByPk(id);
      return !admin
        ? res.status(404).json({ errors: ["Admin not found."] })
        : res.json(admin);
    } catch (err) {
      return res.send(err);
    }
  },
  store: async (req, res) => {
    const admin = req.body;
    const hashedPassword = await bcrypt.hash(admin.password, 8);
    const match = await bcrypt.compare(admin.password, hashedPassword);

    try {
      if (!admin.name || !admin.surname || !admin.email || !hashedPassword) {
        return res
          .status(400)
          .json({ errors: ["All fields are required for admin creation."] });
      }
      await Admin.create({
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
        password: hashedPassword,
      });
      return res.json(admin);
    } catch (err) {
      return res.send(err);
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    const hashedPassword = await bcrypt.hash(admin.password, 8);
    // const match = await bcrypt.compare(unhashedPassword, hashedPassword);
    const adminInfo = req.body;

    if (!admin) res.status(404).json({ errors: ["Admin not found."] });
    if (adminInfo.name) admin.name = adminInfo.name;
    if (adminInfo.surname) admin.surname = adminInfo.surname;
    if (adminInfo.email) admin.email = adminInfo.email;
    if (adminInfo.password) admin.password = hashedPassword;

    await admin.save();
    return res.json(admin);
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({ errors: ["Admin not found."] });
      }
      if (admin.id === 1) {
        return res
          .status(403)
          .json({ errors: ["You cannot delete the admin with ID 1."] });
      }
      admin.destroy();
      return res.json(admin);
    } catch (err) {
      return res.send(err);
    }
  },
};

module.exports = adminController;
