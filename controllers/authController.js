const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
// const { User } = require("../models");

const authController = {
  getToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ where: { email } });
      const token = jwt.sign({ sub: admin.id }, process.env.TOKEN_SECRET);

      if (!admin || admin.password !== password)
        return res.send("Invalid credentials! Check it and try again.");

      return res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Cannot authenticate. Try again.");
    }
  },
};

module.exports = authController;
