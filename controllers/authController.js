const jwt = require("jsonwebtoken");
const { Admin, User } = require("../models");

const authController = {
  getToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });
      let token;

      

      if (admin && admin.password === password) {
        token = jwt.sign(
          { sub: admin.id, role: "Admin" },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({ token });
      }

      const user = await User.findOne({ where: { email } });
      if (user && user.password === password) {
        token = jwt.sign(
          { sub: user.id, role: "User" },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({ token });
      }

      return res.send("Invalid credentials! Check it and try again.");
    } catch (err) {
      return res.status(500).send("Cannot authenticate. Try again.");
    }
  },
};

module.exports = authController;
