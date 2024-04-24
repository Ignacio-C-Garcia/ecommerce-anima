const { Admin } = require("../models");
const bcrypt = require("bcryptjs");

const errorFormatter = require("../utils/errorFormatter");

const adminController = {
  index: async (req, res) => {
    const admins = await Admin.findAll();
    return res.json({ admins });
  },

  show: async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await Admin.findByPk(id);
      return !admin
        ? res.status(404).json({ admin, errors: ["Admin not found"] })
        : res.json({ admin });
    } catch (err) {
      return res.json({ admin: null, errors: errorFormatter(err) });
    }
  },
  store: async (req, res) => {
    const adminInfo = req.body;

    let hashedPassword = undefined;

    if (adminInfo.password) {
      hashedPassword = await bcrypt.hash(adminInfo.password, 8);
    }

    try {
      const admin = await Admin.create({
        name: adminInfo.name,
        surname: adminInfo.surname,
        email: adminInfo.email,
        password: hashedPassword,
      });
      return res.status(201).json({ admin });
    } catch (err) {
      return res.status(400).json({ admin: null, errors: errorFormatter(err) });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) res.status(404).json({ errors: ["Admin not found."] });

    const adminInfo = req.body;
    let hashedPassword = undefined;

    if (adminInfo.passowrd) {
      hashedPassword = await bcrypt.hash(adminInfo.password, 8);
    }

    try {
      admin.update({
        surname: adminInfo.surname,
        name: adminInfo.name,
        email: adminInfo.email,
        password: hashedPassword,
      });
    } catch (err) {
      return res.status(400).json({ admin: null, errors: errorFormatter(err) });
    }

    return res.json({ admin });
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
      return res.json({ admin });
    } catch (err) {
      return res.status(400).json({ admin: null, errors: errorFormatter(err) });
    }
  },
};

module.exports = adminController;
