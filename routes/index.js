const express = require("express");
const { expressjwt: checkJwt } = require("express-jwt");
const router = express.Router();

const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");

router.use(
  "/admins",
  checkJwt({ secret: process.env.TOKEN_WORD, algorithms: ["HS256"] }),
  adminRoutes
);
router.use(
  "/users",
  checkJwt({ secret: process.env.TOKEN_WORD, algorithms: ["HS256"] }),
  userRoutes
);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

const authRoutes = require("./authRoutes");
router.use("/tokens", authRoutes);

module.exports = router;
