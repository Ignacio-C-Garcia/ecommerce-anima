require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const jwtErrorHandler = require("./utils/jwtErrorHandler");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(jwtErrorHandler);
app.listen(process.env.APP_PORT, () =>
  console.log(`Servidor corriendo en http://${process.env.APP_PORT}.\n`)
);
module.exports = app;
