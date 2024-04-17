const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");
const orderRoutes = require("./orderRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const authRoutes = require("./authRoutes");

router.use("/admins", adminRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/tokens", authRoutes);

module.exports = router;
