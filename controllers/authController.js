const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
// const { User } = require("../models");

const authController = {
  getToken: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Esto es equivalente a lo siguiente
      // const email = req.body.email;
      // const password =  req.body.password;

      const admin = await Admin.findOne({ where: { email } });

      if (!admin || admin.password !== password)
        return res.json({
          message: "Invalid credentials! Check it and try again.",
        });

      const token = jwt.sign({ sub: admin.id }, process.env.TOKEN_WORD);

      return res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Cannot authenticate. Try again." });
    }
  },
};

module.exports = authController;
