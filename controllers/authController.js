const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authController = {
  getToken: async (req, res) => {
    const { email, password } = req.body;
    // Esto es equivalente a lo siguiente
    // const email = req.body.email;
    // const password =  req.body.password;

    const user = await User.findOne({ where: { email } });

    if (user === null)
      return res.json({
        message: "Invalid credentials! Try again with new credentials.",
      });

    // const token = jwt.sign({ sub: "user123" }, "TopSecretString");

    return res.json("It's ok");
  },
};

module.exports = authController;
