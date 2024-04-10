const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");
const orderRoutes = require("./orderRoutes");

router.use("/admins", adminRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
