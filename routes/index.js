const express = require("express");
const router = express.Router();
const path = require("path");
const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");
const kittenRoutes = require("./kittenRoutes");

const stripeRoutes = require("./stripeRoutes");

router.use("/admins", adminRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/tokens", authRoutes);
router.use("/kittens", kittenRoutes);
router.use("/stripe", stripeRoutes);
console.log(__dirname);
router.use(
  "/.well-known/apple-developer-merchantid-domain-association",
  (req, res) => {
    const filePath = path.join(
      __dirname,
      "apple-developer-merchantid-domain-association"
    );
    res.sendFile(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al enviar el archivo");
      }
    });
  }
);
router.use(function (req, res) {
  res.status(404).json({ errors: ["Endpoint not found"] });
});

module.exports = router;
