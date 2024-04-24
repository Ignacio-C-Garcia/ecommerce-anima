require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const jwtErrorHandler = require("./utils/jwtErrorHandler");

app.use(express.json());

app.use(routes);
app.use(jwtErrorHandler);
module.exports = app;
