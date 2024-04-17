require("dotenv").config();
const app = require("./index");
app.listen(process.env.APP_PORT, () =>
  console.log(`Servidor corriendo en http://${process.env.APP_DOMAIN}.\n`)
);
