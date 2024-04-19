const express = require("express");
const { expressjwt: checkJwt } = require("express-jwt");
const router = express.Router();

const adminRoutes = require("./adminRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");

const isAdmin = require("../middlewares/isAdmin");
const loggedInUserId = require("../middlewares/users");

router.use(
  "/admins",
  checkJwt({ secret: process.env.TOKEN_SECRET, algorithms: ["HS256"] }),
  isAdmin,
  adminRoutes
);
router.use(
  "/users",
  checkJwt({ secret: process.env.TOKEN_SECRET, algorithms: ["HS256"] }),
  loggedInUserId,
  userRoutes
);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);

const authRoutes = require("./authRoutes");
router.use("/tokens", authRoutes);

module.exports = router;
