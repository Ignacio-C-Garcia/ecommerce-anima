const jwt = require("jsonwebtoken");
const { Admin, User } = require("../models");
const bcrypt = require("bcryptjs");
const authController = {
  getToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw Error("invalid credentials");
      const admin = await Admin.findOne({ where: { email } });
      let token;

      if (admin && (await bcrypt.compare(password, admin.password))) {
        token = jwt.sign(
          { sub: admin.id, role: "Admin" },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({ token });
      }

      const user = await User.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        token = jwt.sign(
          { sub: user.id, role: "User" },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({ token });
      }

      return res.status(400).json({
        token: null,
        errors: ["Cannot authenticate. Try again."],
      });
    } catch (err) {
      return res.status(400).json({
        token: null,
        errors: ["Invalid credentials! Check it and try again"],
      });
    }
  },
};

module.exports = authController;
