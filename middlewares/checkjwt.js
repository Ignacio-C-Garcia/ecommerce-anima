const { expressjwt } = require("express-jwt");
require("dotenv").config();

module.exports = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
});
