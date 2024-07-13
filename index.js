require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const jwtErrorHandler = require("./utils/jwtErrorHandler");
const cors = require("cors");

const sequelizeOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION,
  logging: false,
};

if (process.env.DB_CONNECTION === "postgres") {
  sequelizeOptions.dialectModule = require("pg");
}

app.use(cors());
app.use(express.json());

app.use(routes);
app.use(jwtErrorHandler);
module.exports = app;
